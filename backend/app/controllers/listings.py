import os
import json
from upstash_redis import Redis
from sqlalchemy.orm import Session
from typing import Optional
from app.db import models
from app import schemas

redis_url = os.getenv("UPSTASH_REDIS_REST_URL")
redis_token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
redis_client = None
if redis_url and redis_token:
    redis_client = Redis(url=redis_url, token=redis_token)

def invalidate_listing_cache(listing_id: int):
    if redis_client:
        try:
            redis_client.delete(f"listing:{listing_id}")
        except Exception as e:
            print(f"Redis delete error: {e}")

def get_listings(
    db: Session,
    category: Optional[str] = None,
    location: Optional[str] = None,
    guests: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    host_id: Optional[int] = None
):
    query = db.query(models.Listing)
    if host_id is not None:
        query = query.filter(models.Listing.host_id == host_id)
    if category:
        query = query.filter(models.Listing.category == category)
    if location:
        query = query.filter(models.Listing.location.ilike(f"%{location}%"))
    if guests:
        query = query.filter(models.Listing.max_guests >= guests)
    
    listings = query.all()

    if start_date and end_date:
        available_listings = []
        for listing in listings:
            conflict = db.query(models.Booking).filter(
                models.Booking.listing_id == listing.id,
                models.Booking.status == "confirmed",
                models.Booking.start_date < end_date,
                models.Booking.end_date > start_date
            ).first()
            if not conflict:
                available_listings.append(listing)
        return available_listings

    return listings

def get_listing(db: Session, listing_id: int):
    cache_key = f"listing:{listing_id}"
    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            print(f"Redis get error: {e}")

    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        return None
    
    reviews = db.query(models.Review).filter(models.Review.listing_id == listing_id).order_by(models.Review.created_at.desc()).all()
    bookings = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "confirmed"
    ).all()

    booked_dates = [f"{b.start_date}:{b.end_date}" for b in bookings]
    
    listing_dict = {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price_per_night": listing.price_per_night,
        "location": listing.location,
        "category": listing.category,
        "host_id": listing.host_id,
        "image_url": listing.image_url,
        "gallery_urls": listing.gallery_urls,
        "amenities": listing.amenities,
        "bedrooms": listing.bedrooms,
        "bathrooms": listing.bathrooms,
        "max_guests": listing.max_guests,
        "rating": listing.rating,
        "review_count": listing.review_count,
        "host": {
            "id": listing.host.id,
            "name": listing.host.name,
            "email": listing.host.email,
            "role": listing.host.role,
            "is_superhost": listing.host.is_superhost,
            "avatar_url": listing.host.avatar_url
        },
        "reviews": [
            {
                "id": r.id,
                "listing_id": r.listing_id,
                "author_id": r.author_id,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at,
                "author": {
                    "id": r.author.id,
                    "name": r.author.name,
                    "email": r.author.email,
                    "role": r.author.role,
                    "is_superhost": r.author.is_superhost,
                    "avatar_url": r.author.avatar_url
                }
            } for r in reviews
        ],
        "booked_dates": booked_dates
    }

    if redis_client:
        try:
            redis_client.setex(cache_key, 3600, json.dumps(listing_dict))
        except Exception as e:
            print(f"Redis set error: {e}")

    return listing_dict

def create_listing(db: Session, listing_in: schemas.ListingCreate, host_id: int):
    new_listing = models.Listing(
        title=listing_in.title,
        description=listing_in.description,
        price_per_night=listing_in.price_per_night,
        location=listing_in.location,
        category=listing_in.category,
        host_id=host_id,
        image_url=listing_in.image_url,
        gallery_urls=listing_in.gallery_urls,
        amenities=listing_in.amenities,
        bedrooms=listing_in.bedrooms,
        bathrooms=listing_in.bathrooms,
        max_guests=listing_in.max_guests
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

def update_listing(db: Session, listing_id: int, listing_in: schemas.ListingCreate, host_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing or listing.host_id != host_id:
        return None
    
    for key, value in listing_in.dict().items():
        setattr(listing, key, value)
    
    db.commit()
    db.refresh(listing)
    invalidate_listing_cache(listing_id)
    return listing

def delete_listing(db: Session, listing_id: int, host_id: int) -> bool:
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing or listing.host_id != host_id:
        return False
    
    db.delete(listing)
    db.commit()
    invalidate_listing_cache(listing_id)
    return True

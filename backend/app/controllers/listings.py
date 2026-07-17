from sqlalchemy.orm import Session
from typing import Optional
from app import models, schemas

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
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        return None
    
    reviews = db.query(models.Review).filter(models.Review.listing_id == listing_id).order_by(models.Review.created_at.desc()).all()
    bookings = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "confirmed"
    ).all()

    booked_dates = [f"{b.start_date}:{b.end_date}" for b in bookings]
    listing.reviews = reviews
    listing.booked_dates = booked_dates
    return listing

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
    return listing

def delete_listing(db: Session, listing_id: int, host_id: int) -> bool:
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing or listing.host_id != host_id:
        return False
    
    db.delete(listing)
    db.commit()
    return True

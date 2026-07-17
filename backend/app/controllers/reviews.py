from sqlalchemy.orm import Session
from datetime import datetime
from app.db import models
from app import schemas
from app.controllers.listings import invalidate_listing_cache

def create_review(db: Session, review_in: schemas.ReviewCreate, author_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == review_in.listing_id).first()
    if not listing:
        return None
        
    new_review = models.Review(
        listing_id=review_in.listing_id,
        author_id=author_id,
        rating=review_in.rating,
        comment=review_in.comment,
        created_at=datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(new_review)
    db.commit()
    
    reviews = db.query(models.Review).filter(models.Review.listing_id == review_in.listing_id).all()
    avg_rating = sum(r.rating for r in reviews) / len(reviews)
    listing.rating = round(avg_rating, 2)
    listing.review_count = len(reviews)
    db.commit()
    db.refresh(new_review)
    invalidate_listing_cache(review_in.listing_id)
    return new_review

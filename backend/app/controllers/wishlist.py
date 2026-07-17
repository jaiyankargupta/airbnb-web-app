from sqlalchemy.orm import Session
from app.db import models

def get_wishlist(db: Session, user_id: int):
    favorites = db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()
    listing_ids = [fav.listing_id for fav in favorites]
    if not listing_ids:
        return []
    return db.query(models.Listing).filter(models.Listing.id.in_(listing_ids)).all()

def add_to_wishlist(db: Session, listing_id: int, user_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        return None
        
    exists = db.query(models.Favorite).filter(
        models.Favorite.user_id == user_id,
        models.Favorite.listing_id == listing_id
    ).first()
    if exists:
        return exists
        
    fav = models.Favorite(user_id=user_id, listing_id=listing_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav

def remove_from_wishlist(db: Session, listing_id: int, user_id: int) -> bool:
    fav = db.query(models.Favorite).filter(
        models.Favorite.user_id == user_id,
        models.Favorite.listing_id == listing_id
    ).first()
    if not fav:
        return False
    db.delete(fav)
    db.commit()
    return True

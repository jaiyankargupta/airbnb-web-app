from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas
from app.controllers import wishlist as controller
from app.routers.users import get_current_user_id

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])

@router.get("", response_model=List[schemas.ListingResponse])
def get_wishlist(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return controller.get_wishlist(db, current_user_id)

@router.post("/{listing_id}", response_model=schemas.FavoriteResponse)
def add_to_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    fav = controller.add_to_wishlist(db, listing_id, current_user_id)
    if not fav:
        raise HTTPException(status_code=404, detail="Listing not found")
    return fav

@router.delete("/{listing_id}", status_code=204)
def remove_from_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    success = controller.remove_from_wishlist(db, listing_id, current_user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return

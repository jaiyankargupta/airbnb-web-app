from fastapi import APIRouter, Depends, HTTPException, Header, status, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app import schemas
from app.controllers import listings as controller
from app.routers.users import get_current_user_id, get_me

router = APIRouter(prefix="/api/listings", tags=["listings"])

@router.get("", response_model=List[schemas.ListingResponse])
def read_listings(
    category: Optional[str] = None,
    location: Optional[str] = None,
    guests: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    host_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return controller.get_listings(db, category, location, guests, start_date, end_date, host_id)

@router.get("/{listing_id}", response_model=schemas.ListingDetailResponse)
def read_listing(listing_id: int, response: Response, db: Session = Depends(get_db)):
    listing = controller.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    response.headers["Cache-Control"] = "public, max-age=3600"
    return listing

@router.post("", response_model=schemas.ListingResponse)
def create_listing(
    listing_in: schemas.ListingCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    user = get_me(db, current_user_id)
    if user.role != "host":
        raise HTTPException(status_code=403, detail="Only hosts can create listings")
    return controller.create_listing(db, listing_in, current_user_id)

@router.put("/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(
    listing_id: int,
    listing_in: schemas.ListingCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    listing = controller.update_listing(db, listing_id, listing_in, current_user_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or not authorized")
    return listing

@router.delete("/{listing_id}", status_code=204)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    success = controller.delete_listing(db, listing_id, current_user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found or not authorized")
    return

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app import schemas
from app.controllers import bookings as controller
from app.routers.users import get_current_user_id, get_me

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.get("", response_model=List[schemas.BookingResponse])
def read_bookings(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    user = get_me(db, current_user_id)
    return controller.get_bookings(db, current_user_id, user.role)

@router.post("", response_model=schemas.BookingResponse)
def create_booking(
    booking_in: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    booking, error = controller.create_booking(db, booking_in, current_user_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return booking

@router.delete("/{booking_id}", response_model=schemas.BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    booking = controller.cancel_booking(db, booking_id, current_user_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or not authorized")
    return booking

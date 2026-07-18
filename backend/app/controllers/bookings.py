from sqlalchemy.orm import Session
from app.db import models
from app import schemas
from app.utils import parse_date, calculate_nights
from app.controllers.listings import invalidate_listing_cache

def get_bookings(db: Session, user_id: int, role: str):
    if role == "host":
        return db.query(models.Booking).join(models.Listing).filter(
            models.Listing.host_id == user_id
        ).order_by(models.Booking.start_date.desc()).all()
    
    return db.query(models.Booking).filter(
        models.Booking.guest_id == user_id
    ).order_by(models.Booking.start_date.desc()).all()

def create_booking(db: Session, booking_in: schemas.BookingCreate, guest_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == booking_in.listing_id).first()
    if not listing:
        return None, "Listing not found"
    
    if listing.host_id == guest_id:
        return None, "You cannot book your own listing"
    
    try:
        start_dt = parse_date(booking_in.start_date)
        end_dt = parse_date(booking_in.end_date)
    except ValueError:
        return None, "Invalid date format, use YYYY-MM-DD"
    
    if start_dt >= end_dt:
        return None, "Start date must be before end date"
    
    conflict = db.query(models.Booking).filter(
        models.Booking.listing_id == booking_in.listing_id,
        models.Booking.status == "confirmed",
        models.Booking.start_date < booking_in.end_date,
        models.Booking.end_date > booking_in.start_date
    ).first()
    
    if conflict:
        return None, "Listing is already booked for these dates"
    
    nights = calculate_nights(booking_in.start_date, booking_in.end_date)
    total_price = nights * listing.price_per_night
    
    new_booking = models.Booking(
        listing_id=booking_in.listing_id,
        guest_id=guest_id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        guest_count=booking_in.guest_count,
        total_price=total_price,
        status="confirmed"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    invalidate_listing_cache(new_booking.listing_id)
    return new_booking, None

def cancel_booking(db: Session, booking_id: int, user_id: int):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        return None
    
    if booking.guest_id != user_id:
        listing = db.query(models.Listing).filter(models.Listing.id == booking.listing_id).first()
        if not listing or listing.host_id != user_id:
            return None
            
    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    invalidate_listing_cache(booking.listing_id)
    return booking

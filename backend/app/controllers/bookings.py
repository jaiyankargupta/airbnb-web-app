from sqlalchemy.orm import Session
from datetime import datetime
from app import models, schemas

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
    
    try:
        start_dt = datetime.strptime(booking_in.start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(booking_in.end_date, "%Y-%m-%d")
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
    
    nights = (end_dt - start_dt).days
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
    return booking

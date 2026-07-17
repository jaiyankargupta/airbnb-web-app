from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    is_superhost: bool = False
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    listing_id: int

class ReviewResponse(ReviewBase):
    id: int
    listing_id: int
    author_id: int
    created_at: str
    author: UserResponse

    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    title: str
    description: str
    price_per_night: float
    location: str
    category: str
    image_url: str
    gallery_urls: Optional[str] = None
    amenities: str
    bedrooms: int = 1
    bathrooms: int = 1
    max_guests: int = 2

class ListingCreate(ListingBase):
    pass

class ListingResponse(ListingBase):
    id: int
    host_id: int
    rating: float
    review_count: int

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    listing_id: int
    start_date: str
    end_date: str
    guest_count: int

class BookingCreate(BookingBase):
    pass

class BookingResponse(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    start_date: str
    end_date: str
    guest_count: int
    total_price: float
    status: str
    listing: Optional[ListingResponse] = None

    class Config:
        from_attributes = True

class ListingDetailResponse(ListingResponse):
    host: UserResponse
    reviews: List[ReviewResponse] = []
    booked_dates: List[str] = []

    class Config:
        from_attributes = True

class FavoriteResponse(BaseModel):
    user_id: int
    listing_id: int

    class Config:
        from_attributes = True

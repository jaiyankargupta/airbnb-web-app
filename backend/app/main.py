from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, listings, bookings, reviews, wishlist

app = FastAPI(title="Airbnb Web App Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(wishlist.router)

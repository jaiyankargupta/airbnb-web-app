from app.db import engine, Base, SessionLocal
from app.db import User, Listing, Booking, Review

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    alex = User(
        name="Alex Mercer",
        email="alex@example.com",
        role="guest",
        is_superhost=False,
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    )
    sarah = User(
        name="Sarah Jenkins",
        email="sarah@example.com",
        role="host",
        is_superhost=True,
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    )
    john = User(
        name="John Doe",
        email="john@example.com",
        role="host",
        is_superhost=False,
        avatar_url="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
    )

    db.add(alex)
    db.add(sarah)
    db.add(john)
    db.commit()

    listings = [
        Listing(
            title="The Glass Cabin in the Woods",
            description="Experience nature through glass walls. This modern glass cabin offers luxury amenities nested deep inside a quiet redwood forest. Features floor-to-ceiling glass windows, a private outdoor wood-fired hot tub, custom fireplace, high-speed fiber internet, and a fully equipped chef's kitchen. Perfect for couples or solo travelers looking to disconnect and recharge in absolute style and comfort.",
            price_per_night=250.0,
            location="Redwood Forest, California",
            category="Cabins",
            host_id=sarah.id,
            image_url="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
            gallery_urls="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
            amenities="Wifi,Hot Tub,Kitchen,Fireplace,Free Parking,Heating,Air Conditioning",
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            rating=4.95,
            review_count=2
        ),
        Listing(
            title="Sleek Beachfront Villa",
            description="Wake up to the sound of breaking waves. This sleek architecturally designed beachfront villa features direct beach access, a private infinity pool overlooking the ocean, an expansive wrap-around deck, outdoor dining area, and floor-to-ceiling windows that fill the living space with light. The interior is modern minimalist with high-end designer finishes throughout.",
            price_per_night=450.0,
            location="Malibu, California",
            category="Beachfront",
            host_id=sarah.id,
            image_url="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
            gallery_urls="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
            amenities="Wifi,Pool,Beach Access,Kitchen,Air Conditioning,Free Parking,Dryer,Washer",
            bedrooms=3,
            bathrooms=3,
            max_guests=6,
            rating=4.88,
            review_count=1
        ),
        Listing(
            title="Ultra Luxury Beverly Hills Estate",
            description="Welcome to absolute luxury. This monumental Beverly Hills estate features 6 bedrooms, 7 bathrooms, a home theater, a fully equipped gym, a resort-style swimming pool, and a private tennis court. The grounds are meticulously landscaped offering ultimate privacy. Inside, enjoy soaring ceilings, imported marble floors, and state-of-the-art home automation.",
            price_per_night=950.0,
            location="Beverly Hills, California",
            category="Mansions",
            host_id=john.id,
            image_url="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
            gallery_urls="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            amenities="Wifi,Pool,Gym,Tennis Court,Kitchen,Home Theater,Air Conditioning,Hot Tub",
            bedrooms=6,
            bathrooms=7,
            max_guests=12,
            rating=5.0,
            review_count=1
        ),
        Listing(
            title="Eco-Friendly Bamboo Treehouse",
            description="Live high above the canopy in this stunning, sustainable bamboo treehouse. Nestled in a lush tropical jungle, this architectural masterpiece features an open-concept living area, a suspension bridge entrance, and a plunge pool on the lower deck. Uniquely designed to bring the outside in, it is the perfect romantic eco-escape.",
            price_per_night=180.0,
            location="Ubud, Bali",
            category="Treehouses",
            host_id=sarah.id,
            image_url="https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=800&q=80",
            gallery_urls="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
            amenities="Wifi,Pool,Jungle View,Kitchen,Breakfast Included,Free Parking",
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            rating=4.9,
            review_count=1
        ),
        Listing(
            title="A-Frame Lakefront Retreat",
            description="Charming rustic-modern A-frame cabin situated directly on the shores of Lake Tahoe. Enjoy panoramic lake views from the private dock or while dining on the spacious outdoor deck. The cabin features vaulted wood-beam ceilings, a brick wood-burning fireplace, modern kitchen, and comfortable loft bedrooms. Direct water access for kayaking and swimming.",
            price_per_night=290.0,
            location="Lake Tahoe, Nevada",
            category="Lakefront",
            host_id=john.id,
            image_url="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
            gallery_urls="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
            amenities="Wifi,Lake Access,Dock,Kitchen,Fireplace,Heating,Kayak,Free Parking",
            bedrooms=2,
            bathrooms=1.5,
            max_guests=4,
            rating=4.78,
            review_count=1
        ),
        Listing(
            title="Cozy Mid-Century Modern Apartment",
            description="Beautifully styled mid-century modern apartment in the heart of downtown Chicago. Features custom designer furniture, curated local art, large windows overlooking the city skyline, a dedicated home office setup, and building amenities including a rooftop lounge and fitness center. Steps away from top restaurants and museums.",
            price_per_night=150.0,
            location="Chicago, Illinois",
            category="Trending",
            host_id=john.id,
            image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            gallery_urls="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80",
            amenities="Wifi,Gym,Kitchen,Air Conditioning,Heating,Elevator,Washing Machine,Dryer",
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            rating=4.82,
            review_count=1
        )
    ]

    for item in listings:
        db.add(item)
    db.commit()

    bookings = [
        Booking(
            listing_id=listings[0].id,
            guest_id=alex.id,
            start_date="2026-08-01",
            end_date="2026-08-05",
            guest_count=2,
            total_price=1000.0,
            status="confirmed"
        ),
        Booking(
            listing_id=listings[1].id,
            guest_id=alex.id,
            start_date="2026-08-10",
            end_date="2026-08-14",
            guest_count=4,
            total_price=1800.0,
            status="confirmed"
        )
    ]

    for b in bookings:
        db.add(b)
    db.commit()

    reviews = [
        Review(
            listing_id=listings[0].id,
            author_id=alex.id,
            rating=5,
            comment="This cabin was absolutely breathtaking. The glass walls make you feel like you are sleeping in the middle of the forest. The wood-fired hot tub was hot and ready when we arrived. Host was extremely responsive. Highly recommend!",
            created_at="2026-07-10"
        ),
        Review(
            listing_id=listings[0].id,
            author_id=john.id,
            rating=4,
            comment="Lovely place to disconnect. The architecture is outstanding. However, we found it a bit cold at night, but the fireplace helped. The surroundings are incredibly quiet.",
            created_at="2026-07-12"
        ),
        Review(
            listing_id=listings[1].id,
            author_id=alex.id,
            rating=5,
            comment="Unbelievable beachfront views. The infinity pool is amazing. Waking up to the ocean sound was a dream come true.",
            created_at="2026-07-15"
        ),
        Review(
            listing_id=listings[2].id,
            author_id=alex.id,
            rating=5,
            comment="Breathtaking estate. Perfect for our family retreat. Total luxury and privacy.",
            created_at="2026-07-14"
        ),
        Review(
            listing_id=listings[3].id,
            author_id=john.id,
            rating=5,
            comment="Incredible architecture. It feels like you are living in a dream. Ubud jungle is beautiful.",
            created_at="2026-07-15"
        ),
        Review(
            listing_id=listings[4].id,
            author_id=alex.id,
            rating=4,
            comment="Great spot right on Lake Tahoe. Private dock is wonderful. We went kayaking every day.",
            created_at="2026-07-11"
        ),
        Review(
            listing_id=listings[5].id,
            author_id=sarah.id,
            rating=5,
            comment="Super convenient, cleanly styled apartment in a great part of Chicago. Very comfortable bed.",
            created_at="2026-07-16"
        )
    ]

    for r in reviews:
        db.add(r)
    db.commit()

    db.close()

if __name__ == "__main__":
    seed_db()

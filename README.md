# Airbnb Web App - SDE Fullstack Assignment

A fully functional clone of the Airbnb marketplace web application replicating Airbnb's visual aesthetics, user experience, and core booking flows.

## Tech Stack

- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS, Lucide Icons)
- **Backend**: Python 3.12 (FastAPI, SQLAlchemy ORM, Uvicorn Server)
- **Database**: SQLite (relational database storage)
- **Design System Alignment**: StitchMCP (tokens for light theme layout, palette, and rounded shapes)

---

## Architectural Design & Folder Structure

The repository is divided into frontend and backend applications to isolate concerns:

```
airbnb-web-app/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Database logic and CRUD operations
│   │   ├── db/               # SQLAlchemy engine setup and model definitions
│   │   ├── routers/          # FastAPI REST endpoints
│   │   ├── utils/            # Shared helper functions (dates, etc.)
│   │   ├── main.py           # FastAPI server entry point and CORS middleware
│   │   ├── schemas.py        # Pydantic input/output schemas
│   │   └── seed.py           # SQLite initialization and seed script
│   └── requirements.txt      # Python backend packages
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (Explore, Detail, Trips, Host, Wishlist)
│   │   ├── components/       # Shared UI and modular subcomponents (Header, Footer, Modals)
│   │   ├── context/          # React AppContext for active user, search state, and toasts
│   │   ├── utils/            # Centralized API HTTP client
│   │   └── styles/           # CSS design variables and custom utilities
│   ├── .env.local            # Environment configuration
│   └── package.json          # Node dependencies
```

---

## Database Schema (SQLite)

The SQLite database design uses normalized relational tables:

1. **users**
   - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
   - `name`: TEXT NOT NULL
   - `email`: TEXT UNIQUE NOT NULL
   - `role`: TEXT NOT NULL ("guest", "host")
   - `is_superhost`: INTEGER DEFAULT 0 (boolean)
   - `avatar_url`: TEXT

2. **listings**
   - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
   - `title`: TEXT NOT NULL
   - `description`: TEXT NOT NULL
   - `price_per_night`: REAL NOT NULL
   - `location`: TEXT NOT NULL
   - `category`: TEXT NOT NULL (e.g., "Cabins", "Beachfront", "Mansions")
   - `host_id`: INTEGER NOT NULL (FK users.id)
   - `image_url`: TEXT NOT NULL (Primary gallery image)
   - `gallery_urls`: TEXT (Comma-separated gallery image URLs)
   - `amenities`: TEXT NOT NULL (Comma-separated amenities list)
   - `bedrooms`: INTEGER DEFAULT 1
   - `bathrooms`: INTEGER DEFAULT 1
   - `max_guests`: INTEGER DEFAULT 2
   - `rating`: REAL DEFAULT 5.0
   - `review_count`: INTEGER DEFAULT 0

3. **bookings**
   - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
   - `listing_id`: INTEGER NOT NULL (FK listings.id)
   - `guest_id`: INTEGER NOT NULL (FK users.id)
   - `start_date`: TEXT NOT NULL (YYYY-MM-DD)
   - `end_date`: TEXT NOT NULL (YYYY-MM-DD)
   - `guest_count`: INTEGER NOT NULL
   - `total_price`: REAL NOT NULL
   - `status`: TEXT NOT NULL DEFAULT "confirmed"

4. **reviews**
   - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
   - `listing_id`: INTEGER NOT NULL (FK listings.id)
   - `author_id`: INTEGER NOT NULL (FK users.id)
   - `rating`: INTEGER NOT NULL
   - `comment`: TEXT NOT NULL
   - `created_at`: TEXT NOT NULL (YYYY-MM-DD)

5. **favorites**
   - `user_id`: INTEGER NOT NULL (FK users.id)
   - `listing_id`: INTEGER NOT NULL (FK listings.id)
   - PRIMARY KEY (user_id, listing_id)

---

## Setup Instructions

### 1. Backend Setup (FastAPI & SQLite)

Change to the backend directory, initialize a Python virtual environment, install dependencies, and seed the SQLite database:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
```

Start the FastAPI backend server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
The API docs will be accessible at `http://localhost:8000/docs`.

### 2. Frontend Setup (Next.js)

Open a new terminal window, navigate to the frontend directory, install npm packages, and run the development server:

```bash
cd frontend
npm install
npm run dev
```
The application will launch on `http://localhost:3000`.

---

## Core Features Implemented

1. **Home & Search**: Explore grid, category filtering (Cabins, Beachfront, Mansions, Treehouses, Lakefront, Trending), price threshold filter, and search modal (location text, check-in/out calendars, guest increments).
2. **Details Page**: Interactive 5-photo grid layout, amenities list, availability calendar check blocking conflicting date ranges, live reservation price breakdown, and host profile details (Superhost recognition).
3. **Booking Checkout**: Date validation constraints, total sum calculator, mock card checkout submission form, success confirmation overlay, and automated date-blocking in calendars.
4. **Trips History**: lists current guest bookings, future cancel options, and a modal for submitting reviews on stayed listings.
5. **Host CRUD Dashboard**: Active listing performance metrics, listings creations, edits, deletions, and an review history summary of guest reservations.
6. **Wishlist**: Favorites grid populated via listing card heart indicators.
7. **Evaluator Switcher**: The profile dropdown menu allows switching between three pre-seeded accounts (1 Guest, 2 Hosts) to test different user scopes in real time.

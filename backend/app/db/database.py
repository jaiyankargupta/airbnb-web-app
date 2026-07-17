import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

load_dotenv()

db_url = os.getenv("TURSO_DATABASE_URL", "sqlite:///./airbnb.db")
connect_args = {}

if db_url.startswith("libsql://") or db_url.startswith("https://"):
    base = db_url.replace("libsql://", "").replace("https://", "")
    sqlalchemy_url = f"sqlite+libsql://{base}"
    if "?" in base:
        if "secure=true" not in base:
            sqlalchemy_url += "&secure=true"
    else:
        sqlalchemy_url += "?secure=true"
        
    auth_token = os.getenv("TURSO_AUTH_TOKEN")
    if auth_token:
        connect_args["auth_token"] = auth_token
elif db_url.startswith("sqlite"):
    sqlalchemy_url = db_url
    connect_args = {"check_same_thread": False}
else:
    sqlalchemy_url = db_url

if "libsql" in sqlalchemy_url:
    engine = create_engine(sqlalchemy_url, connect_args=connect_args, poolclass=NullPool)
else:
    engine = create_engine(sqlalchemy_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

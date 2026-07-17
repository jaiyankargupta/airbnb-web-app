from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app.controllers import reviews as controller
from app.routers.users import get_current_user_id

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("", response_model=schemas.ReviewResponse)
def create_review(
    review_in: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    review = controller.create_review(db, review_in, current_user_id)
    if not review:
        raise HTTPException(status_code=404, detail="Listing not found")
    return review

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app import schemas
from app.controllers import users as controller

router = APIRouter(prefix="/api/users", tags=["users"])

def get_current_user_id(x_user_id: Optional[str] = Header(None)) -> int:
    if x_user_id:
        try:
            return int(x_user_id)
        except ValueError:
            pass
    return 1

@router.get("/me", response_model=schemas.UserResponse)
def get_me(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    user = controller.get_user(db, current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me/role", response_model=schemas.UserResponse)
def update_my_role(role_data: dict, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    new_role = role_data.get("role")
    if new_role not in ["guest", "host"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    user = controller.update_user_role(db, current_user_id, new_role)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

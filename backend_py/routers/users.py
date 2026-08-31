import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.user import User
from backend_py.schemas.user import UserUpdate, UserActivityCreate
from backend_py.middleware.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("")
def get_users(
    role: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(User)

    if role:
        norm = role.lower().replace("role_", "")
        query = query.filter(User.role.ilike(f"%{norm}%"))

    if status_filter:
        query = query.filter(User.status == status_filter)

    if search:
        s = f"%{search}%"
        query = query.filter((User.name.ilike(s)) | (User.email.ilike(s)))

    users = query.all()
    return {
        "success": True,
        "count": len(users),
        "users": [u.to_dict() for u in users]
    }


@router.get("/{user_id}")
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return {
        "success": True,
        "user": user.to_dict()
    }


@router.put("/{user_id}")
def update_user(user_id: str, updates: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    update_data = updates.model_dump(exclude_unset=True)

    # Map camelCase to snake_case
    field_mappings = {
        "streakDays": "streak_days",
        "assignedMentorId": "assigned_mentor_id",
        "assignedMentorName": "assigned_mentor_name",
        "assignedLearnerIds": "assigned_learner_ids",
        "enrolledCourseIds": "enrolled_course_ids",
        "completedCourseIds": "completed_course_ids",
        "weeklyHours": "weekly_hours"
    }

    for k, v in update_data.items():
        attr_name = field_mappings.get(k, k)
        if hasattr(user, attr_name):
            setattr(user, attr_name, v)

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "User profile updated successfully.",
        "user": user.to_dict()
    }


@router.post("/{user_id}/toggle-status")
def toggle_user_status(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.status = "inactive" if user.status == "active" else "active"
    db.commit()

    return {
        "success": True,
        "message": f"User status updated to {user.status}.",
        "user": user.to_dict()
    }


@router.post("/{user_id}/activity")
def add_user_activity(user_id: str, act: UserActivityCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    new_act = {
        "id": f"act-{int(time.time() * 1000)}",
        "type": act.type,
        "title": act.title,
        "description": act.description,
        "timestamp": "Just now",
        "scoreOrPoints": act.scoreOrPoints
    }

    current_activity = list(user.recent_activity or [])
    current_activity.insert(0, new_act)
    user.recent_activity = current_activity[:15]  # Keep last 15
    db.commit()

    return {
        "success": True,
        "activity": new_act,
        "user": user.to_dict()
    }


@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    db.delete(user)
    db.commit()

    return {
        "success": True,
        "message": "User account deleted successfully."
    }

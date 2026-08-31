import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.feedback import CourseFeedback, PlatformFeedbackItem
from backend_py.models.course import Course
from backend_py.models.user import User
from backend_py.schemas.feedback import CourseFeedbackCreate, PlatformFeedbackCreate
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.get("/courses/{course_id}")
def get_course_feedback(course_id: str, db: Session = Depends(get_db)):
    feedback_list = db.query(CourseFeedback).filter(CourseFeedback.course_id == course_id).all()
    avg_rating = round(sum(f.rating for f in feedback_list) / len(feedback_list), 1) if feedback_list else 5.0
    return {
        "success": True,
        "count": len(feedback_list),
        "averageRating": avg_rating,
        "feedback": [f.to_dict() for f in feedback_list]
    }


@router.post("/courses/{course_id}")
def submit_course_feedback(
    course_id: str,
    req: CourseFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == user_id).first()

    new_fb = CourseFeedback(
        id=f"cfb-{int(time.time() * 1000)}",
        course_id=course_id,
        course_title=course.title,
        user_id=user_id,
        user_name=req.userName or (user.name if user else "Student"),
        user_avatar=req.userAvatar or (user.avatar if user else None),
        rating=req.rating,
        comment=req.comment,
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_fb)

    # Re-calculate course rating
    all_fb = db.query(CourseFeedback).filter(CourseFeedback.course_id == course_id).all()
    all_fb.append(new_fb)
    course.reviews_count = len(all_fb)
    course.rating = round(sum(f.rating for f in all_fb) / len(all_fb), 1)

    db.commit()
    db.refresh(new_fb)

    return {
        "success": True,
        "message": "Feedback submitted successfully.",
        "feedback": new_fb.to_dict()
    }


@router.get("/platform")
def get_platform_feedback(db: Session = Depends(get_db)):
    items = db.query(PlatformFeedbackItem).order_by(PlatformFeedbackItem.created_at.desc()).all()
    avg_rating = round(sum(i.rating for i in items) / len(items), 1) if items else 5.0
    return {
        "success": True,
        "count": len(items),
        "averageRating": avg_rating,
        "feedback": [i.to_dict() for i in items]
    }


@router.post("/platform")
def submit_platform_feedback(
    req: PlatformFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == user_id).first()

    new_pfb = PlatformFeedbackItem(
        id=f"pfb-{int(time.time() * 1000)}",
        user_id=user_id,
        user_name=req.userName or (user.name if user else "Student"),
        rating=req.rating,
        category=req.category or "General",
        comment=req.comment,
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_pfb)
    db.commit()
    db.refresh(new_pfb)

    return {
        "success": True,
        "message": "Platform feedback received. Thank you!",
        "feedback": new_pfb.to_dict()
    }

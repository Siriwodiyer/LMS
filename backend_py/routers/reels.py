import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.reel import Reel
from backend_py.models.user import User
from backend_py.models.progress import UserWatchProgress
from backend_py.schemas.reel import ReelCreate, ReelUpdate
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/reels", tags=["Reels"])


@router.get("")
def get_reels(
    category: Optional[str] = Query(None),
    subject: Optional[str] = Query(None),
    creator_id: Optional[str] = Query(None, alias="creatorId"),
    difficulty: Optional[str] = Query(None),
    published_only: Optional[bool] = Query(None, alias="publishedOnly"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Reel)

    if category and category != "All":
        query = query.filter(Reel.category.ilike(f"%{category}%"))

    if subject:
        query = query.filter(Reel.subject.ilike(f"%{subject}%"))

    if creator_id:
        query = query.filter(Reel.creator_id == creator_id)

    if difficulty and difficulty != "All":
        query = query.filter(Reel.difficulty == difficulty)

    if published_only is True:
        query = query.filter(Reel.is_published == True)

    if search:
        s = f"%{search}%"
        query = query.filter((Reel.title.ilike(s)) | (Reel.description.ilike(s)))

    reels = query.all()
    return {
        "success": True,
        "count": len(reels),
        "reels": [r.to_dict() for r in reels]
    }


@router.get("/watched-status/{user_id}")
def get_watched_status(user_id: str, db: Session = Depends(get_db)):
    progress = db.query(UserWatchProgress).filter(UserWatchProgress.user_id == user_id).first()
    watched = progress.watched_learn_reel_ids if progress else []
    return {
        "success": True,
        "userId": user_id,
        "watchedLearnReelIds": watched or [],
        "completedCount": len(watched or []),
        "isUnlocked": len(watched or []) >= 6
    }


@router.get("/{reel_id}")
def get_reel_by_id(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")
    return {
        "success": True,
        "reel": reel.to_dict()
    }


@router.post("")
def create_reel(
    data: ReelCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    creator_id = current_user.id if current_user else (data.creatorId or "user-mentor")
    creator_user = db.query(User).filter(User.id == creator_id).first()

    creator_name = creator_user.name if creator_user else (data.creatorName or "Instructor")
    creator_avatar = creator_user.avatar if creator_user else data.creatorAvatar
    creator_role = (creator_user.role.capitalize() if creator_user else data.creatorRole) or "Mentor"

    new_reel = Reel(
        id=f"reel-{int(time.time() * 1000)}",
        title=data.title,
        description=data.description or "",
        category=data.category,
        subject=data.subject,
        topic=data.topic,
        course_id=data.courseId,
        course_title=data.courseTitle,
        video_url=data.videoUrl,
        thumbnail_url=data.thumbnailUrl,
        creator_id=creator_id,
        creator_name=creator_name,
        creator_avatar=creator_avatar,
        creator_role=creator_role,
        difficulty=data.difficulty or "Beginner",
        duration_seconds=data.durationSeconds or 60,
        likes_count=0,
        comments_count=0,
        shares_count=0,
        views_count=0,
        is_published=data.isPublished if data.isPublished is not None else True,
        tags=data.tags or [],
        questions=data.questions or [],
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_reel)
    db.commit()
    db.refresh(new_reel)

    return {
        "success": True,
        "message": "Reel created successfully.",
        "reel": new_reel.to_dict()
    }


@router.put("/{reel_id}")
def update_reel(reel_id: str, updates: ReelUpdate, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    update_dict = updates.model_dump(exclude_unset=True)
    field_map = {
        "courseId": "course_id",
        "courseTitle": "course_title",
        "videoUrl": "video_url",
        "thumbnailUrl": "thumbnail_url",
        "durationSeconds": "duration_seconds",
        "isPublished": "is_published"
    }

    for k, v in update_dict.items():
        attr = field_map.get(k, k)
        if hasattr(reel, attr):
            setattr(reel, attr, v)

    db.commit()
    db.refresh(reel)

    return {
        "success": True,
        "message": "Reel updated successfully.",
        "reel": reel.to_dict()
    }


@router.delete("/{reel_id}")
def delete_reel(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    db.delete(reel)
    db.commit()

    return {
        "success": True,
        "message": "Reel deleted successfully."
    }


@router.post("/{reel_id}/like")
def toggle_like(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    reel.likes_count = (reel.likes_count or 0) + 1
    db.commit()

    return {
        "success": True,
        "likesCount": reel.likes_count,
        "message": "Reel like recorded."
    }


@router.post("/{reel_id}/bookmark")
def toggle_bookmark(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    return {
        "success": True,
        "message": "Bookmark toggled."
    }


@router.post("/{reel_id}/view")
def increment_view(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    reel.views_count = (reel.views_count or 0) + 1
    db.commit()

    return {
        "success": True,
        "viewsCount": reel.views_count
    }


@router.post("/{reel_id}/toggle-publish")
def toggle_publish(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    reel.is_published = not reel.is_published
    db.commit()

    return {
        "success": True,
        "isPublished": reel.is_published,
        "message": f"Reel {'published' if reel.is_published else 'hidden'}."
    }


@router.post("/{reel_id}/learn-complete")
def mark_learn_reel_complete(
    reel_id: str,
    user_id: Optional[str] = Query(None, alias="userId"),
    db: Session = Depends(get_db)
):
    target_user_id = user_id or "user-student"
    progress = db.query(UserWatchProgress).filter(UserWatchProgress.user_id == target_user_id).first()

    if not progress:
        progress = UserWatchProgress(user_id=target_user_id, watched_learn_reel_ids=[reel_id], completed_course_reels={})
        db.add(progress)
    else:
        watched = list(progress.watched_learn_reel_ids or [])
        if reel_id not in watched:
            watched.append(reel_id)
            progress.watched_learn_reel_ids = watched

    # Award points to user if first time
    user = db.query(User).filter(User.id == target_user_id).first()
    if user:
        user.points = (user.points or 0) + 10
        user.xp = (user.xp or 0) + 20
        user.reels_watched_total = (user.reels_watched_total or 0) + 1

    db.commit()

    return {
        "success": True,
        "message": "Learn reel marked as completed.",
        "watchedLearnReelIds": progress.watched_learn_reel_ids,
        "completedCount": len(progress.watched_learn_reel_ids),
        "isUnlocked": len(progress.watched_learn_reel_ids) >= 6
    }

import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.comment import Comment
from backend_py.models.reel import Reel
from backend_py.models.user import User
from backend_py.schemas.comment import CommentCreate, FlagCommentRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.get("/reels/{reel_id}")
def get_reel_comments(reel_id: str, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.reel_id == reel_id).order_by(Comment.created_at.desc()).all()
    return {
        "success": True,
        "count": len(comments),
        "comments": [c.to_dict() for c in comments]
    }


@router.post("/reels/{reel_id}")
def add_comment(
    reel_id: str,
    req: CommentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    reel = db.query(Reel).filter(Reel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel not found.")

    user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == user_id).first()

    new_comment = Comment(
        id=f"comm-{int(time.time() * 1000)}",
        reel_id=reel_id,
        user_id=user_id,
        user_name=req.userName or (user.name if user else "Learner"),
        user_avatar=req.userAvatar or (user.avatar if user else None),
        content=req.content,
        likes=0,
        is_flagged=False,
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_comment)
    reel.comments_count = (reel.comments_count or 0) + 1
    db.commit()
    db.refresh(new_comment)

    return {
        "success": True,
        "message": "Comment posted.",
        "comment": new_comment.to_dict()
    }


@router.post("/{comment_id}/like")
def like_comment(comment_id: str, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found.")

    comment.likes = (comment.likes or 0) + 1
    db.commit()

    return {
        "success": True,
        "likes": comment.likes
    }


@router.delete("/{comment_id}")
def delete_comment(comment_id: str, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found.")

    reel = db.query(Reel).filter(Reel.id == comment.reel_id).first()
    if reel and (reel.comments_count or 0) > 0:
        reel.comments_count -= 1

    db.delete(comment)
    db.commit()

    return {
        "success": True,
        "message": "Comment deleted."
    }


@router.post("/{comment_id}/flag")
def flag_comment(comment_id: str, req: FlagCommentRequest, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found.")

    comment.is_flagged = True
    comment.flag_reason = req.reason
    db.commit()

    return {
        "success": True,
        "message": "Comment flagged for moderator review."
    }

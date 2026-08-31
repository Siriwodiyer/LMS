from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.notification import NotificationItem
from backend_py.models.user import User
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def get_notifications(
    user_id: Optional[str] = Query(None, alias="userId"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    target_user_id = user_id or (current_user.id if current_user else "user-student")
    notifs = db.query(NotificationItem).filter(
        NotificationItem.user_id == target_user_id
    ).order_by(NotificationItem.created_at.desc()).all()

    unread_count = sum(1 for n in notifs if not n.read)

    return {
        "success": True,
        "count": len(notifs),
        "unreadCount": unread_count,
        "notifications": [n.to_dict() for n in notifs]
    }


@router.post("/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(NotificationItem).filter(NotificationItem.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")

    notif.read = True
    db.commit()

    return {
        "success": True,
        "message": "Notification marked as read."
    }


@router.post("/mark-all-read")
def mark_all_read(
    user_id: Optional[str] = Query(None, alias="userId"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    target_user_id = user_id or (current_user.id if current_user else "user-student")
    db.query(NotificationItem).filter(NotificationItem.user_id == target_user_id).update({"read": True})
    db.commit()

    return {
        "success": True,
        "message": "All notifications marked as read."
    }


@router.delete("/clear-all")
def clear_all_notifications(
    user_id: Optional[str] = Query(None, alias="userId"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    target_user_id = user_id or (current_user.id if current_user else "user-student")
    db.query(NotificationItem).filter(NotificationItem.user_id == target_user_id).delete()
    db.commit()

    return {
        "success": True,
        "message": "All notifications cleared."
    }

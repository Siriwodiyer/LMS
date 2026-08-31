import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.reward import BadgeDefinition, DiscountVoucher
from backend_py.models.user import User
from backend_py.schemas.reward import BadgeDefCreate, BadgeDefUpdate, RedeemVoucherRequest

router = APIRouter(prefix="/rewards", tags=["Rewards"])


@router.get("/badge-definitions")
def get_badge_definitions(db: Session = Depends(get_db)):
    defs = db.query(BadgeDefinition).all()
    return {
        "success": True,
        "count": len(defs),
        "badgeDefinitions": [b.to_dict() for b in defs]
    }


@router.post("/badge-definitions")
def create_badge_definition(data: BadgeDefCreate, db: Session = Depends(get_db)):
    new_def = BadgeDefinition(
        id=f"badge-def-{int(time.time() * 1000)}",
        title=data.title,
        description=data.description,
        icon=data.icon or "🏆",
        rarity=data.rarity or "common",
        condition_type=data.conditionType or "reels_watched",
        condition_course_id=data.conditionCourseId,
        condition_threshold=data.conditionThreshold or 0.0,
        condition_text=data.conditionText or "",
        is_active=data.isActive if data.isActive is not None else True,
        earned_count=0,
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_def)
    db.commit()
    db.refresh(new_def)

    return {
        "success": True,
        "message": "Badge definition created successfully.",
        "badgeDefinition": new_def.to_dict()
    }


@router.put("/badge-definitions/{badge_id}")
def update_badge_definition(badge_id: str, updates: BadgeDefUpdate, db: Session = Depends(get_db)):
    badge_def = db.query(BadgeDefinition).filter(BadgeDefinition.id == badge_id).first()
    if not badge_def:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge definition not found.")

    update_dict = updates.model_dump(exclude_unset=True)
    field_map = {
        "conditionType": "condition_type",
        "conditionCourseId": "condition_course_id",
        "conditionThreshold": "condition_threshold",
        "conditionText": "condition_text",
        "isActive": "is_active"
    }

    for k, v in update_dict.items():
        attr = field_map.get(k, k)
        if hasattr(badge_def, attr):
            setattr(badge_def, attr, v)

    db.commit()
    db.refresh(badge_def)

    return {
        "success": True,
        "message": "Badge definition updated.",
        "badgeDefinition": badge_def.to_dict()
    }


@router.post("/badge-definitions/{badge_id}/toggle")
def toggle_badge_active(badge_id: str, db: Session = Depends(get_db)):
    badge_def = db.query(BadgeDefinition).filter(BadgeDefinition.id == badge_id).first()
    if not badge_def:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge definition not found.")

    badge_def.is_active = not badge_def.is_active
    db.commit()

    return {
        "success": True,
        "isActive": badge_def.is_active,
        "message": f"Badge is now {'active' if badge_def.is_active else 'disabled'}."
    }


@router.get("/vouchers")
def get_vouchers(db: Session = Depends(get_db)):
    vouchers = db.query(DiscountVoucher).all()
    return {
        "success": True,
        "count": len(vouchers),
        "vouchers": [v.to_dict() for v in vouchers]
    }


@router.post("/vouchers/redeem")
def redeem_voucher(req: RedeemVoucherRequest, db: Session = Depends(get_db)):
    voucher = db.query(DiscountVoucher).filter(
        DiscountVoucher.code == req.code.strip(),
        DiscountVoucher.is_used == False
    ).first()

    if not voucher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or expired discount code.")

    discount_percent = voucher.discount_percent
    price = req.coursePrice or 0.0
    discount_amount = (price * discount_percent) / 100.0
    final_price = max(0.0, price - discount_amount)

    return {
        "success": True,
        "discountPercent": discount_percent,
        "discountAmount": round(discount_amount, 2),
        "finalPrice": round(final_price, 2),
        "message": f"Applied {discount_percent}% discount!"
    }


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.status == "active").order_by(User.points.desc()).limit(20).all()
    leaderboard = []
    for rank, u in enumerate(users, start=1):
        leaderboard.append({
            "rank": rank,
            "id": u.id,
            "name": u.name,
            "avatar": u.avatar,
            "role": u.role,
            "points": u.points,
            "xp": u.xp,
            "streakDays": u.streak_days,
            "level": u.level,
            "badgesCount": len(u.badges or [])
        })

    return {
        "success": True,
        "leaderboard": leaderboard
    }


@router.get("/user/{user_id}/badges")
def get_user_badges(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return {
        "success": True,
        "badges": user.badges or [],
        "count": len(user.badges or [])
    }

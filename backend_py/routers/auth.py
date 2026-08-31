import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.user import User
from backend_py.models.reward import BadgeDefinition, DiscountVoucher
from backend_py.schemas.auth import RegisterRequest, LoginRequest, SwitchRoleRequest
from backend_py.middleware.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    trimmed_email = str(req.email).strip().lower()
    existing = db.query(User).filter(User.email == trimmed_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in."
        )

    # Get sample badge and voucher
    badge_def = db.query(BadgeDefinition).first()
    voucher_item = db.query(DiscountVoucher).first()

    now_str = datetime.utcnow().isoformat()
    new_id = f"user-{int(time.time() * 1000)}"

    sample_badges = [{
        "id": "badge-1",
        "title": badge_def.title if badge_def else "Speed Learner",
        "description": badge_def.description if badge_def else "Completed your first micro-assessment!",
        "icon": badge_def.icon if badge_def else "⚡",
        "unlockedAt": now_str,
        "rarity": "rare"
    }]

    sample_vouchers = [{
        "id": "vouch-1",
        "code": voucher_item.code if voucher_item else "WELCOME20",
        "discountPercent": voucher_item.discount_percent if voucher_item else 20,
        "description": "Welcome voucher: 20% off",
        "expiresAt": now_str,
        "isUsed": False
    }]

    new_user = User(
        id=new_id,
        name=req.name.strip(),
        email=trimmed_email,
        password=req.password or "password123",
        avatar=req.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={req.name.strip()}",
        role="student",
        status="active",
        points=500,
        xp=1000,
        streak_days=1,
        level=1,
        enrolled_course_ids=["course-java"],
        completed_course_ids=[],
        badges=sample_badges,
        discount_vouchers=sample_vouchers,
        registered_at=now_str,
        last_active=now_str,
        weekly_hours=[1.0, 1.5, 0.5, 2.0, 1.0, 0.0, 0.0],
        recent_activity=[{
            "id": f"act-{int(time.time() * 1000)}",
            "type": "login",
            "title": "Account Created",
            "description": "Welcome to LMS! Started learning journey.",
            "timestamp": "Just now"
        }]
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"userId": new_user.id, "role": new_user.role, "email": new_user.email})

    return {
        "success": True,
        "message": "Account created successfully.",
        "token": token,
        "user": new_user.to_dict()
    }


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    trimmed_email = str(req.email).strip().lower()
    user = db.query(User).filter(User.email == trimmed_email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found with this email. Please register."
        )

    # Password validation
    if req.password and not verify_password(req.password, user.password or ""):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password. Please check your credentials."
        )

    # Role validation if specified
    if req.role:
        normalized_req = req.role.lower().replace("role_", "")
        user_norm = user.role.lower().replace("role_", "")
        if normalized_req == "mentor" and user_norm != "mentor":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Account does not have approved Mentor credentials."
            )
        if normalized_req == "admin" and user_norm != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Administrator privileges required."
            )

    user.last_active = datetime.utcnow().isoformat()
    db.commit()

    token = create_access_token({"userId": user.id, "role": user.role, "email": user.email})

    return {
        "success": True,
        "message": f"Welcome back, {user.name}!",
        "token": token,
        "user": user.to_dict()
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "user": current_user.to_dict()
    }


@router.post("/switch-role")
def switch_role(req: SwitchRoleRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    allowed_roles = ["student", "mentor", "admin", "learner", "seller"]
    if req.role not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role specified.")

    current_user.role = req.role
    db.commit()

    token = create_access_token({"userId": current_user.id, "role": current_user.role, "email": current_user.email})

    return {
        "success": True,
        "message": f"Switched active role to {req.role}.",
        "token": token,
        "user": current_user.to_dict()
    }


@router.post("/token/refresh")
def refresh_token(current_user: User = Depends(get_current_user)):
    token = create_access_token({"userId": current_user.id, "role": current_user.role, "email": current_user.email})
    return {
        "success": True,
        "token": token,
        "user": current_user.to_dict()
    }

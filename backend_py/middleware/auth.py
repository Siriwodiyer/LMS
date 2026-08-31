from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from backend_py.config import settings
from backend_py.database import get_db
from backend_py.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return True
    # Allow fallback for demo passwords
    if hashed_password in ["password123", "admin123", "mentor123"] and plain_password in [hashed_password, "password123"]:
        return True
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return plain_password == hashed_password


def get_password_hash(password: str) -> str:
    try:
        return pwd_context.hash(password)
    except Exception:
        return password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not auth or not auth.credentials:
        return None
    token = auth.credentials
    payload = decode_token(token)
    if not payload:
        return None
    user_id: str = payload.get("userId")
    if not user_id:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = auth.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id: str = payload.get("userId")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user account not found.",
        )
    return user


def require_role(allowed_roles: List[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        user_role = current_user.role.lower().replace("role_", "")
        allowed = [r.lower().replace("role_", "") for r in allowed_roles]
        if user_role not in allowed and "admin" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Requires one of roles {allowed_roles}. Current role: {current_user.role}",
            )
        return current_user
    return role_checker

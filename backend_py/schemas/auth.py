from typing import Optional, Dict, Any
from pydantic import BaseModel


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = "password123"
    avatar: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    role: Optional[str] = None


class SwitchRoleRequest(BaseModel):
    role: str


class TokenData(BaseModel):
    userId: str
    role: str
    email: str


class AuthResponse(BaseModel):
    success: bool = True
    message: str
    token: str
    user: Dict[str, Any]

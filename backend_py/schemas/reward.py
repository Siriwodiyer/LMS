from typing import Optional
from pydantic import BaseModel


class BadgeDefCreate(BaseModel):
    title: str
    description: str
    icon: Optional[str] = "🏆"
    rarity: Optional[str] = "common"
    conditionType: Optional[str] = "reels_watched"
    conditionCourseId: Optional[str] = None
    conditionThreshold: Optional[float] = 0.0
    conditionText: Optional[str] = ""
    isActive: Optional[bool] = True


class BadgeDefUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    rarity: Optional[str] = None
    conditionType: Optional[str] = None
    conditionCourseId: Optional[str] = None
    conditionThreshold: Optional[float] = None
    conditionText: Optional[str] = None
    isActive: Optional[bool] = None


class RedeemVoucherRequest(BaseModel):
    code: str
    coursePrice: Optional[float] = 0.0

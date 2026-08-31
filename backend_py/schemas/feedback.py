from typing import Optional
from pydantic import BaseModel


class CourseFeedbackCreate(BaseModel):
    userId: Optional[str] = None
    userName: Optional[str] = None
    userAvatar: Optional[str] = None
    rating: float
    comment: str


class PlatformFeedbackCreate(BaseModel):
    userId: Optional[str] = None
    userName: Optional[str] = None
    rating: float
    category: Optional[str] = "General"
    comment: str

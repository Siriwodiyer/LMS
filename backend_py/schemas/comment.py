from typing import Optional
from pydantic import BaseModel


class CommentCreate(BaseModel):
    userId: Optional[str] = None
    userName: Optional[str] = None
    userAvatar: Optional[str] = None
    content: str


class FlagCommentRequest(BaseModel):
    reason: str

from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text
from backend_py.database import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(100), primary_key=True, index=True)
    reel_id = Column(String(100), nullable=False, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    user_name = Column(String(255), nullable=False)
    user_avatar = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    is_flagged = Column(Boolean, default=False)
    flag_reason = Column(String(255), nullable=True)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "reelId": self.reel_id,
            "userId": self.user_id,
            "userName": self.user_name,
            "userAvatar": self.user_avatar,
            "content": self.content,
            "likes": self.likes,
            "isFlagged": self.is_flagged,
            "flagReason": self.flag_reason,
            "createdAt": self.created_at
        }

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Text
from backend_py.database import Base


class NotificationItem(Base):
    __tablename__ = "notifications"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system")
    read = Column(Boolean, default=False)
    action_url = Column(Text, nullable=True)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "read": self.read,
            "actionUrl": self.action_url,
            "createdAt": self.created_at
        }

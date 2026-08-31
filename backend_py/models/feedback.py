from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text
from backend_py.database import Base


class CourseFeedback(Base):
    __tablename__ = "course_feedback"

    id = Column(String(100), primary_key=True, index=True)
    course_id = Column(String(100), nullable=False, index=True)
    course_title = Column(String(255), nullable=True)
    user_id = Column(String(100), nullable=False, index=True)
    user_name = Column(String(255), nullable=False)
    user_avatar = Column(Text, nullable=True)
    rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "courseId": self.course_id,
            "courseTitle": self.course_title,
            "userId": self.user_id,
            "userName": self.user_name,
            "userAvatar": self.user_avatar,
            "rating": self.rating,
            "comment": self.comment,
            "createdAt": self.created_at
        }


class PlatformFeedbackItem(Base):
    __tablename__ = "platform_feedback"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    user_name = Column(String(255), nullable=False)
    rating = Column(Float, default=5.0)
    category = Column(String(100), default="General")
    comment = Column(Text, nullable=False)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "userName": self.user_name,
            "rating": self.rating,
            "category": self.category,
            "comment": self.comment,
            "createdAt": self.created_at
        }

from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, JSON
from backend_py.database import Base


class Reel(Base):
    __tablename__ = "reels"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    subject = Column(String(100), nullable=True)
    topic = Column(String(100), nullable=True)
    course_id = Column(String(100), nullable=True, index=True)
    course_title = Column(String(255), nullable=True)
    video_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text, nullable=False)
    creator_id = Column(String(100), nullable=False, index=True)
    creator_name = Column(String(255), nullable=False)
    creator_avatar = Column(Text, nullable=True)
    creator_role = Column(String(50), default="Mentor")
    difficulty = Column(String(50), default="Beginner")
    duration_seconds = Column(Integer, default=60)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    tags = Column(JSON, default=list)
    questions = Column(JSON, default=list)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description or "",
            "category": self.category,
            "subject": self.subject,
            "topic": self.topic,
            "courseId": self.course_id,
            "courseTitle": self.course_title,
            "videoUrl": self.video_url,
            "thumbnailUrl": self.thumbnail_url,
            "creatorId": self.creator_id,
            "creatorName": self.creator_name,
            "creatorAvatar": self.creator_avatar,
            "creatorRole": self.creator_role,
            "difficulty": self.difficulty,
            "durationSeconds": self.duration_seconds,
            "likesCount": self.likes_count,
            "commentsCount": self.comments_count,
            "sharesCount": self.shares_count,
            "viewsCount": self.views_count,
            "isPublished": self.is_published,
            "tags": self.tags or [],
            "questions": self.questions or [],
            "createdAt": self.created_at
        }

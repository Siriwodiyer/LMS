from sqlalchemy import Column, String, JSON
from backend_py.database import Base


class UserWatchProgress(Base):
    __tablename__ = "user_watch_progress"

    user_id = Column(String(100), primary_key=True, index=True)
    watched_learn_reel_ids = Column(JSON, default=list)  # ["reel-1", "reel-2", ...]
    completed_course_reels = Column(JSON, default=dict)  # { "course-1": ["cr-1", "cr-2"] }

    def to_dict(self):
        return {
            "userId": self.user_id,
            "watchedLearnReelIds": self.watched_learn_reel_ids or [],
            "completedCourseReels": self.completed_course_reels or {}
        }

from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text
from backend_py.database import Base


class EnrolledStudent(Base):
    __tablename__ = "enrolled_students"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    user_name = Column(String(255), nullable=False)
    user_email = Column(String(255), nullable=False)
    user_avatar = Column(Text, nullable=True)
    course_id = Column(String(100), nullable=False, index=True)
    course_title = Column(String(255), nullable=False)
    enrolled_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    progress_percent = Column(Integer, default=0)
    completed_at = Column(String(100), nullable=True)
    last_active = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    quiz_average = Column(Float, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "userName": self.user_name,
            "userEmail": self.user_email,
            "userAvatar": self.user_avatar,
            "courseId": self.course_id,
            "courseTitle": self.course_title,
            "enrolledAt": self.enrolled_at,
            "progressPercent": self.progress_percent,
            "completedAt": self.completed_at,
            "lastActive": self.last_active,
            "quizAverage": self.quiz_average
        }

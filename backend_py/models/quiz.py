from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, JSON
from backend_py.database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String(100), primary_key=True, index=True)
    course_id = Column(String(100), nullable=False, index=True)
    course_title = Column(String(255), nullable=True)
    module_id = Column(String(100), nullable=False, index=True)
    module_title = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="Beginner")
    total_marks = Column(Integer, default=100)
    passing_percentage = Column(Float, default=80.0)
    questions = Column(JSON, default=list)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "courseId": self.course_id,
            "courseTitle": self.course_title,
            "moduleId": self.module_id,
            "moduleTitle": self.module_title,
            "title": self.title,
            "difficulty": self.difficulty,
            "totalMarks": self.total_marks,
            "passingPercentage": self.passing_percentage,
            "questions": self.questions or [],
            "createdAt": self.created_at
        }

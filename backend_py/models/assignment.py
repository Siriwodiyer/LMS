from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, JSON
from backend_py.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(100), primary_key=True, index=True)
    course_id = Column(String(100), nullable=False, index=True)
    course_title = Column(String(255), nullable=True)
    module_id = Column(String(100), nullable=False, index=True)
    module_title = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=False)
    due_date = Column(String(100), nullable=False)
    max_marks = Column(Integer, default=100)
    submission_type = Column(String(50), default="code")
    submissions = Column(JSON, default=list)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "courseId": self.course_id,
            "courseTitle": self.course_title,
            "moduleId": self.module_id,
            "moduleTitle": self.module_title,
            "title": self.title,
            "instructions": self.instructions,
            "dueDate": self.due_date,
            "maxMarks": self.max_marks,
            "submissionType": self.submission_type,
            "submissions": self.submissions or [],
            "createdAt": self.created_at
        }

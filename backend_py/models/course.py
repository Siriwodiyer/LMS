from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, JSON
from backend_py.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    price = Column(Float, default=0.0)
    discounted_price = Column(Float, nullable=True)
    instructor_id = Column(String(100), nullable=False, index=True)
    instructor_name = Column(String(255), nullable=False)
    instructor_avatar = Column(Text, nullable=True)
    instructor_bio = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=False)
    level = Column(String(50), default="Beginner")
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    students_count = Column(Integer, default=0)

    modules = Column(JSON, default=list)
    reels = Column(JSON, default=list)
    learning_outcomes = Column(JSON, default=list)

    status = Column(String(50), default="published", index=True)
    rejection_feedback = Column(Text, nullable=True)
    submitted_at = Column(String(100), nullable=True)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    duration_hours = Column(Float, default=5.0)
    progress_percent = Column(Integer, default=0)
    last_lesson_title = Column(String(255), nullable=True)
    lessons_count = Column(Integer, default=5)
    reels_count = Column(Integer, default=5)
    quizzes_count = Column(Integer, default=1)
    assignments_count = Column(Integer, default=1)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "subtitle": self.subtitle or "",
            "description": self.description or "",
            "category": self.category,
            "price": self.price,
            "discountedPrice": self.discounted_price,
            "instructorId": self.instructor_id,
            "instructorName": self.instructor_name,
            "instructorAvatar": self.instructor_avatar,
            "instructorBio": self.instructor_bio or "",
            "thumbnailUrl": self.thumbnail_url,
            "level": self.level,
            "rating": self.rating,
            "reviewsCount": self.reviews_count,
            "studentsCount": self.students_count,
            "modules": self.modules or [],
            "reels": self.reels or [],
            "learningOutcomes": self.learning_outcomes or [],
            "status": self.status,
            "rejectionFeedback": self.rejection_feedback,
            "submittedAt": self.submitted_at,
            "createdAt": self.created_at,
            "durationHours": self.duration_hours,
            "progressPercent": self.progress_percent,
            "lastLessonTitle": self.last_lesson_title,
            "lessonsCount": self.lessons_count,
            "reelsCount": self.reels_count,
            "quizzesCount": self.quizzes_count,
            "assignmentsCount": self.assignments_count
        }

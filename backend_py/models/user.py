import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, JSON
from backend_py.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)  # Plain/hashed for compatibility
    avatar = Column(Text, nullable=True)
    role = Column(String(50), default="student", index=True)
    status = Column(String(50), default="active", index=True)
    points = Column(Integer, default=500)
    xp = Column(Integer, default=1000)
    streak_days = Column(Integer, default=1)
    level = Column(Integer, default=1)

    is_eligible_for_mentor = Column(Boolean, default=False)
    mentor_application_id = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    specialty = Column(String(255), nullable=True)
    assigned_mentor_id = Column(String(100), nullable=True)
    assigned_mentor_name = Column(String(255), nullable=True)

    # JSON collections
    assigned_learner_ids = Column(JSON, default=list)
    enrolled_course_ids = Column(JSON, default=list)
    completed_course_ids = Column(JSON, default=list)
    badges = Column(JSON, default=list)
    discount_vouchers = Column(JSON, default=list)
    weekly_hours = Column(JSON, default=lambda: [1.0, 1.5, 0.5, 2.0, 1.0, 0.0, 0.0])
    recent_activity = Column(JSON, default=list)

    registered_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    last_active = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    total_learning_hours = Column(Float, default=0.0)
    quiz_average = Column(Float, default=0.0)
    completed_lessons_count = Column(Integer, default=0)
    reels_watched_total = Column(Integer, default=0)
    assignments_completed_count = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatar": self.avatar,
            "role": self.role,
            "status": self.status,
            "points": self.points,
            "xp": self.xp,
            "streakDays": self.streak_days,
            "level": self.level,
            "isEligibleForMentor": self.is_eligible_for_mentor,
            "mentorApplicationId": self.mentor_application_id,
            "bio": self.bio,
            "specialty": self.specialty,
            "assignedMentorId": self.assigned_mentor_id,
            "assignedMentorName": self.assigned_mentor_name,
            "assignedLearnerIds": self.assigned_learner_ids or [],
            "enrolledCourseIds": self.enrolled_course_ids or [],
            "completedCourseIds": self.completed_course_ids or [],
            "badges": self.badges or [],
            "discountVouchers": self.discount_vouchers or [],
            "weeklyHours": self.weekly_hours or [0, 0, 0, 0, 0, 0, 0],
            "recentActivity": self.recent_activity or [],
            "registeredAt": self.registered_at,
            "lastActive": self.last_active,
            "totalLearningHours": self.total_learning_hours,
            "quizAverage": self.quiz_average,
            "completedLessonsCount": self.completed_lessons_count,
            "reelsWatchedTotal": self.reels_watched_total,
            "assignmentsCompletedCount": self.assignments_completed_count
        }

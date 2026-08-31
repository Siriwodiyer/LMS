from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, JSON
from backend_py.database import Base


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    reel_ids = Column(JSON, default=list)
    total_questions = Column(Integer, default=6)
    correct_count = Column(Integer, default=0)
    score_percentage = Column(Float, default=0.0)
    passed = Column(Boolean, default=False)
    completed_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    rewards_earned = Column(JSON, default=dict)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "reelIds": self.reel_ids or [],
            "totalQuestions": self.total_questions,
            "correctCount": self.correct_count,
            "scorePercentage": self.score_percentage,
            "passed": self.passed,
            "completedAt": self.completed_at,
            "rewardsEarned": self.rewards_earned or {
                "points": 0,
                "badge": None,
                "voucher": None,
                "goodie": None
            }
        }

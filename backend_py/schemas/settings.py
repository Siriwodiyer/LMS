from typing import Optional
from pydantic import BaseModel


class AdminSettingsUpdate(BaseModel):
    passingScoreThreshold: Optional[int] = None
    reelsPerAssessment: Optional[int] = None
    pointsPerCorrectAnswer: Optional[int] = None
    streakBonusMultiplier: Optional[float] = None
    mentorEligibilityMinAssessments: Optional[int] = None
    mentorEligibilityMinScore: Optional[int] = None
    mentorEligibilityAvgScore: Optional[int] = None

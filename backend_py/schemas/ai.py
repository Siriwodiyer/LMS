from typing import Optional, List
from pydantic import BaseModel


class AIInsightsRequest(BaseModel):
    userId: Optional[str] = None


class AIChatRequest(BaseModel):
    message: str
    userId: Optional[str] = None
    courseId: Optional[str] = None
    reelId: Optional[str] = None


class AIQuizGenRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "Beginner"
    numQuestions: Optional[int] = 5

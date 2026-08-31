from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class QuizCreate(BaseModel):
    courseId: str
    courseTitle: Optional[str] = None
    moduleId: str
    moduleTitle: Optional[str] = None
    title: str
    difficulty: Optional[str] = "Beginner"
    totalMarks: Optional[int] = 100
    passingPercentage: Optional[float] = 80.0
    questions: Optional[List[Dict[str, Any]]] = []


class QuizSubmitRequest(BaseModel):
    userId: Optional[str] = None
    answers: Dict[str, int]  # questionIndex or questionId -> selectedIndex

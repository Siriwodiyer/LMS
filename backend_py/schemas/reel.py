from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class QuestionItem(BaseModel):
    id: Optional[str] = None
    reelId: Optional[str] = None
    courseId: Optional[str] = None
    moduleId: Optional[str] = None
    category: str = "General"
    type: str = "mcq"
    prompt: str
    options: List[str]
    correctIndex: int
    explanation: str = ""
    difficulty: Optional[str] = "Beginner"
    marks: Optional[int] = 10


class ReelCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    category: str
    subject: Optional[str] = None
    topic: Optional[str] = None
    courseId: Optional[str] = None
    courseTitle: Optional[str] = None
    videoUrl: str
    thumbnailUrl: str
    creatorId: Optional[str] = None
    creatorName: Optional[str] = None
    creatorAvatar: Optional[str] = None
    creatorRole: Optional[str] = "Mentor"
    difficulty: Optional[str] = "Beginner"
    durationSeconds: Optional[int] = 60
    isPublished: Optional[bool] = True
    tags: Optional[List[str]] = []
    questions: Optional[List[Dict[str, Any]]] = []


class ReelUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    courseId: Optional[str] = None
    courseTitle: Optional[str] = None
    videoUrl: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    difficulty: Optional[str] = None
    durationSeconds: Optional[int] = None
    isPublished: Optional[bool] = None
    tags: Optional[List[str]] = None
    questions: Optional[List[Dict[str, Any]]] = None

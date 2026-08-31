from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    courseId: str
    courseTitle: Optional[str] = None
    moduleId: str
    moduleTitle: Optional[str] = None
    title: str
    instructions: str
    dueDate: str
    maxMarks: Optional[int] = 100
    submissionType: Optional[str] = "code"


class SubmissionCreate(BaseModel):
    userId: Optional[str] = None
    userName: Optional[str] = None
    content: str


class GradeSubmissionRequest(BaseModel):
    grade: float
    feedback: Optional[str] = ""

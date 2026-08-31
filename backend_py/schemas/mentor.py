from typing import Optional, List
from pydantic import BaseModel


class MentorApplicationCreate(BaseModel):
    userId: Optional[str] = None
    applicantName: str
    applicantEmail: str
    applicantAvatar: Optional[str] = None
    expertise: str
    skills: List[str]
    experienceYears: int
    bio: str
    portfolioUrl: Optional[str] = None
    assessmentsCompleted: Optional[int] = 3
    averageScore: Optional[float] = 85.0


class MentorReviewRequest(BaseModel):
    action: str  # 'approve' | 'reject' | 'request_changes'
    feedback: Optional[str] = ""
    reviewerName: Optional[str] = "Admin Reviewer"


class MentorResubmitRequest(BaseModel):
    expertise: Optional[str] = None
    skills: Optional[List[str]] = None
    experienceYears: Optional[int] = None
    bio: Optional[str] = None
    portfolioUrl: Optional[str] = None

from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    specialty: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    points: Optional[int] = None
    xp: Optional[int] = None
    streakDays: Optional[int] = None
    level: Optional[int] = None
    assignedMentorId: Optional[str] = None
    assignedMentorName: Optional[str] = None
    assignedLearnerIds: Optional[List[str]] = None
    enrolledCourseIds: Optional[List[str]] = None
    completedCourseIds: Optional[List[str]] = None
    weeklyHours: Optional[List[float]] = None


class UserActivityCreate(BaseModel):
    type: str  # 'reel' | 'quiz' | 'course' | 'badge' | 'login' | 'assignment'
    title: str
    description: str
    scoreOrPoints: Optional[str] = None

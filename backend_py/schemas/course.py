from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    category: str = "General"
    price: Optional[float] = 0.0
    discountedPrice: Optional[float] = None
    instructorId: Optional[str] = None
    instructorName: Optional[str] = None
    instructorAvatar: Optional[str] = None
    instructorBio: Optional[str] = None
    thumbnailUrl: Optional[str] = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
    level: Optional[str] = "Beginner"
    modules: Optional[List[Dict[str, Any]]] = []
    reels: Optional[List[Dict[str, Any]]] = []
    learningOutcomes: Optional[List[str]] = []
    status: Optional[str] = "submitted"
    durationHours: Optional[float] = 5.0
    lessonsCount: Optional[int] = 5
    reelsCount: Optional[int] = 5
    quizzesCount: Optional[int] = 1
    assignmentsCount: Optional[int] = 1


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    discountedPrice: Optional[float] = None
    thumbnailUrl: Optional[str] = None
    level: Optional[str] = None
    modules: Optional[List[Dict[str, Any]]] = None
    reels: Optional[List[Dict[str, Any]]] = None
    learningOutcomes: Optional[List[str]] = None
    status: Optional[str] = None
    durationHours: Optional[float] = None


class EnrollRequest(BaseModel):
    courseId: Optional[str] = None
    discountCode: Optional[str] = None


class CourseStatusUpdateRequest(BaseModel):
    status: str
    feedback: Optional[str] = None

from typing import Optional
from pydantic import BaseModel


class ApprovalSubmitRequest(BaseModel):
    contentType: str
    contentId: str
    title: str
    categoryOrSubject: str
    creatorId: Optional[str] = None
    creatorName: Optional[str] = None
    creatorRole: Optional[str] = "Mentor"


class ApprovalActionRequest(BaseModel):
    action: str  # 'approve' | 'reject' | 'request_changes' | 'publish'
    feedback: Optional[str] = ""
    reviewerName: Optional[str] = "Platform Admin"
    publishImmediately: Optional[bool] = False

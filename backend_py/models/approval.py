from datetime import datetime
from sqlalchemy import Column, String, Text, JSON
from backend_py.database import Base


class ContentApprovalItem(Base):
    __tablename__ = "approval_items"

    id = Column(String(100), primary_key=True, index=True)
    content_type = Column(String(50), nullable=False)
    content_id = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category_or_subject = Column(String(100), nullable=False)
    creator_id = Column(String(100), nullable=False, index=True)
    creator_name = Column(String(255), nullable=False)
    creator_role = Column(String(50), default="Mentor")
    status = Column(String(50), default="submitted", index=True)
    submission_date = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    reviewed_date = Column(String(100), nullable=True)
    reviewed_by = Column(String(255), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    feedback_history = Column(JSON, default=list)

    def to_dict(self):
        return {
            "id": self.id,
            "contentType": self.content_type,
            "contentId": self.content_id,
            "title": self.title,
            "categoryOrSubject": self.category_or_subject,
            "creatorId": self.creator_id,
            "creatorName": self.creator_name,
            "creatorRole": self.creator_role,
            "status": self.status,
            "submissionDate": self.submission_date,
            "reviewedDate": self.reviewed_date,
            "reviewedBy": self.reviewed_by,
            "rejectionReason": self.rejection_reason,
            "feedbackHistory": self.feedback_history or []
        }

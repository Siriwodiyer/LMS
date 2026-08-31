from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, JSON
from backend_py.database import Base


class MentorApplication(Base):
    __tablename__ = "mentor_applications"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), nullable=False, index=True)
    applicant_name = Column(String(255), nullable=False)
    applicant_email = Column(String(255), nullable=False)
    applicant_avatar = Column(Text, nullable=True)
    expertise = Column(String(255), nullable=False)
    skills = Column(JSON, default=list)
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=False)
    portfolio_url = Column(Text, nullable=True)
    assessments_completed = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    status = Column(String(50), default="submitted", index=True)
    submission_date = Column(String(100), default=lambda: datetime.utcnow().isoformat())
    reviewed_date = Column(String(100), nullable=True)
    reviewed_by = Column(String(255), nullable=True)
    admin_feedback = Column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "applicantName": self.applicant_name,
            "applicantEmail": self.applicant_email,
            "applicantAvatar": self.applicant_avatar,
            "expertise": self.expertise,
            "skills": self.skills or [],
            "experienceYears": self.experience_years,
            "bio": self.bio,
            "portfolioUrl": self.portfolio_url,
            "assessmentsCompleted": self.assessments_completed,
            "averageScore": self.average_score,
            "status": self.status,
            "submissionDate": self.submission_date,
            "reviewedDate": self.reviewed_date,
            "reviewedBy": self.reviewed_by,
            "adminFeedback": self.admin_feedback
        }

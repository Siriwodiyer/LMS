from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.settings import AdminAnalyticsModel
from backend_py.models.user import User
from backend_py.models.course import Course
from backend_py.models.reel import Reel
from backend_py.models.assessment import AssessmentResult
from backend_py.models.approval import ContentApprovalItem

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/admin")
def get_admin_analytics(db: Session = Depends(get_db)):
    analytics_row = db.query(AdminAnalyticsModel).filter(AdminAnalyticsModel.id == "default").first()

    # Dynamic counts
    total_users = db.query(User).count()
    total_courses = db.query(Course).count()
    published_courses = db.query(Course).filter(Course.status == "published").count()
    total_reels = db.query(Reel).count()
    total_mentors = db.query(User).filter(User.role.in_(["mentor", "ROLE_MENTOR"])).count()
    pending_approvals = db.query(ContentApprovalItem).filter(ContentApprovalItem.status == "submitted").count()
    assessments_completed = db.query(AssessmentResult).count()

    base_dict = analytics_row.to_dict() if analytics_row else {}
    base_dict.update({
        "totalUsers": max(total_users, base_dict.get("totalUsers", 0)),
        "totalCourses": max(total_courses, base_dict.get("totalCourses", 0)),
        "publishedCourses": published_courses,
        "totalEducationalReels": total_reels,
        "approvedMentorsCount": max(total_mentors, base_dict.get("approvedMentorsCount", 0)),
        "pendingCourseReviews": pending_approvals,
        "totalAssessmentsCompleted": max(assessments_completed, base_dict.get("totalAssessmentsCompleted", 0))
    })

    return {
        "success": True,
        "analytics": base_dict
    }


@router.get("/overview")
def get_platform_overview(db: Session = Depends(get_db)):
    total_learners = db.query(User).filter(User.role.in_(["student", "learner", "ROLE_LEARNER"])).count()
    active_learners = db.query(User).filter(User.role.in_(["student", "learner", "ROLE_LEARNER"]), User.status == "active").count()
    total_mentors = db.query(User).filter(User.role.in_(["mentor", "ROLE_MENTOR"])).count()
    active_mentors = db.query(User).filter(User.role.in_(["mentor", "ROLE_MENTOR"]), User.status == "active").count()
    total_courses = db.query(Course).count()
    published_courses = db.query(Course).filter(Course.status == "published").count()
    total_reels = db.query(Reel).filter(Reel.is_published == True).count()

    return {
        "success": True,
        "overview": {
            "totalLearners": max(total_learners, 1),
            "activeLearners": max(active_learners, 1),
            "totalMentors": max(total_mentors, 1),
            "activeMentors": max(active_mentors, 1),
            "totalCourses": total_courses,
            "publishedCourses": published_courses,
            "totalEducationalReels": total_reels,
            "overallCourseCompletionRate": 78.4
        }
    }

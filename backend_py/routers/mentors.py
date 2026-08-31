import time
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.mentor import MentorApplication
from backend_py.models.user import User
from backend_py.models.enrolled_student import EnrolledStudent
from backend_py.models.notification import NotificationItem
from backend_py.schemas.mentor import MentorApplicationCreate, MentorReviewRequest, MentorResubmitRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/mentors", tags=["Mentors"])


@router.get("")
def get_mentors(db: Session = Depends(get_db)):
    mentors = db.query(User).filter(User.role.in_(["mentor", "ROLE_MENTOR"])).all()
    return {
        "success": True,
        "count": len(mentors),
        "mentors": [m.to_dict() for m in mentors]
    }


@router.get("/applications")
def get_mentor_applications(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(MentorApplication)
    if status_filter:
        query = query.filter(MentorApplication.status == status_filter)

    apps = query.all()
    return {
        "success": True,
        "count": len(apps),
        "applications": [a.to_dict() for a in apps]
    }


@router.get("/applications/{app_id}")
def get_application_by_id(app_id: str, db: Session = Depends(get_db)):
    app = db.query(MentorApplication).filter(MentorApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor application not found.")
    return {
        "success": True,
        "application": app.to_dict()
    }


@router.post("/applications")
def submit_mentor_application(
    req: MentorApplicationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == user_id).first()

    new_app = MentorApplication(
        id=f"app-{int(time.time() * 1000)}",
        user_id=user_id,
        applicant_name=req.applicantName,
        applicant_email=str(req.applicantEmail),
        applicant_avatar=req.applicantAvatar or (user.avatar if user else None),
        expertise=req.expertise,
        skills=req.skills,
        experience_years=req.experienceYears,
        bio=req.bio,
        portfolio_url=req.portfolioUrl,
        assessments_completed=req.assessmentsCompleted or 3,
        average_score=req.averageScore or 85.0,
        status="submitted",
        submission_date=datetime.utcnow().isoformat()
    )

    db.add(new_app)

    if user:
        user.mentor_application_id = new_app.id

    db.commit()
    db.refresh(new_app)

    return {
        "success": True,
        "message": "Mentor application submitted successfully. It is now pending admin review.",
        "application": new_app.to_dict()
    }


@router.post("/applications/{app_id}/review")
def review_mentor_application(app_id: str, req: MentorReviewRequest, db: Session = Depends(get_db)):
    app = db.query(MentorApplication).filter(MentorApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    action = req.action.lower()
    now_str = datetime.utcnow().isoformat()
    reviewer = req.reviewerName or "Admin Reviewer"

    app.reviewed_date = now_str
    app.reviewed_by = reviewer
    app.admin_feedback = req.feedback

    user = db.query(User).filter(User.id == app.user_id).first()

    if action == "approve":
        app.status = "approved"
        if user:
            user.role = "mentor"
            user.specialty = app.expertise

        notif = NotificationItem(
            id=f"notif-{int(time.time() * 1000)}",
            user_id=app.user_id,
            title="Mentor Application Approved!",
            message=f"Congratulations! Your application as a {app.expertise} mentor has been approved.",
            type="mentor",
            read=False,
            created_at=now_str
        )
        db.add(notif)

    elif action == "reject":
        app.status = "rejected"
        notif = NotificationItem(
            id=f"notif-{int(time.time() * 1000)}",
            user_id=app.user_id,
            title="Mentor Application Update",
            message=f"Your application was not approved: {req.feedback}",
            type="mentor",
            read=False,
            created_at=now_str
        )
        db.add(notif)

    elif action in ["request_changes", "request-changes"]:
        app.status = "changes_requested"
        notif = NotificationItem(
            id=f"notif-{int(time.time() * 1000)}",
            user_id=app.user_id,
            title="Changes Requested on Mentor Application",
            message=f"Admin feedback: {req.feedback}. Please update your profile.",
            type="mentor",
            read=False,
            created_at=now_str
        )
        db.add(notif)

    db.commit()

    return {
        "success": True,
        "message": f"Application status updated to {app.status}.",
        "application": app.to_dict()
    }


@router.post("/applications/{app_id}/resubmit")
def resubmit_mentor_application(app_id: str, updates: MentorResubmitRequest, db: Session = Depends(get_db)):
    app = db.query(MentorApplication).filter(MentorApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    update_dict = updates.model_dump(exclude_unset=True)
    field_map = {
        "experienceYears": "experience_years",
        "portfolioUrl": "portfolio_url"
    }

    for k, v in update_dict.items():
        attr = field_map.get(k, k)
        if hasattr(app, attr):
            setattr(app, attr, v)

    app.status = "submitted"
    app.submission_date = datetime.utcnow().isoformat()
    db.commit()

    return {
        "success": True,
        "message": "Mentor application resubmitted for review.",
        "application": app.to_dict()
    }


@router.get("/my-students/{mentor_id}")
def get_mentor_students(mentor_id: str, db: Session = Depends(get_db)):
    students = db.query(User).filter(User.assigned_mentor_id == mentor_id).all()
    return {
        "success": True,
        "count": len(students),
        "students": [s.to_dict() for s in students]
    }

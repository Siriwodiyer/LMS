import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.assignment import Assignment
from backend_py.models.user import User
from backend_py.schemas.assignment import AssignmentCreate, SubmissionCreate, GradeSubmissionRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.get("")
def get_assignments(
    course_id: Optional[str] = Query(None, alias="courseId"),
    module_id: Optional[str] = Query(None, alias="moduleId"),
    db: Session = Depends(get_db)
):
    query = db.query(Assignment)
    if course_id:
        query = query.filter(Assignment.course_id == course_id)
    if module_id:
        query = query.filter(Assignment.module_id == module_id)

    assignments = query.all()
    return {
        "success": True,
        "count": len(assignments),
        "assignments": [a.to_dict() for a in assignments]
    }


@router.get("/{assignment_id}")
def get_assignment_by_id(assignment_id: str, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")
    return {
        "success": True,
        "assignment": assignment.to_dict()
    }


@router.post("")
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    new_assignment = Assignment(
        id=f"ass-{int(time.time() * 1000)}",
        course_id=data.courseId,
        course_title=data.courseTitle,
        module_id=data.moduleId,
        module_title=data.moduleTitle,
        title=data.title,
        instructions=data.instructions,
        due_date=data.dueDate,
        max_marks=data.maxMarks or 100,
        submission_type=data.submissionType or "code",
        submissions=[],
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return {
        "success": True,
        "message": "Assignment created successfully.",
        "assignment": new_assignment.to_dict()
    }


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    db.delete(assignment)
    db.commit()

    return {
        "success": True,
        "message": "Assignment deleted successfully."
    }


@router.post("/{assignment_id}/submit")
def submit_assignment(
    assignment_id: str,
    req: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == user_id).first()
    user_name = req.userName or (user.name if user else "Student")

    new_sub = {
        "id": f"sub-{int(time.time() * 1000)}",
        "assignmentId": assignment_id,
        "userId": user_id,
        "userName": user_name,
        "submittedAt": datetime.utcnow().isoformat(),
        "content": req.content,
        "status": "pending",
        "marksAwarded": None,
        "feedback": None
    }

    submissions = list(assignment.submissions or [])
    # Replace existing or append
    existing_idx = next((i for i, s in enumerate(submissions) if s.get("userId") == user_id), -1)
    if existing_idx >= 0:
        submissions[existing_idx] = new_sub
    else:
        submissions.append(new_sub)

    assignment.submissions = submissions

    if user:
        user.assignments_completed_count = (user.assignments_completed_count or 0) + 1
        act = {
            "id": f"act-{int(time.time() * 1000)}",
            "type": "assignment",
            "title": f"Submitted Assignment: {assignment.title}",
            "description": "Submitted for mentor review",
            "timestamp": "Just now",
            "scoreOrPoints": "Pending"
        }
        activity = list(user.recent_activity or [])
        activity.insert(0, act)
        user.recent_activity = activity[:15]

    db.commit()

    return {
        "success": True,
        "message": "Assignment submitted successfully!",
        "submission": new_sub
    }


@router.post("/{assignment_id}/submissions/{sub_id}/grade")
def grade_submission(
    assignment_id: str,
    sub_id: str,
    req: GradeSubmissionRequest,
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    submissions = list(assignment.submissions or [])
    sub_idx = next((i for i, s in enumerate(submissions) if s.get("id") == sub_id), -1)
    if sub_idx == -1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found.")

    submissions[sub_idx]["status"] = "graded"
    submissions[sub_idx]["marksAwarded"] = req.grade
    submissions[sub_idx]["feedback"] = req.feedback

    assignment.submissions = submissions
    db.commit()

    return {
        "success": True,
        "message": "Submission graded successfully.",
        "submission": submissions[sub_idx]
    }

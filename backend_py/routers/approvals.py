import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.approval import ContentApprovalItem
from backend_py.models.course import Course
from backend_py.models.reel import Reel
from backend_py.schemas.approval import ApprovalSubmitRequest, ApprovalActionRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.get("")
def get_approvals(
    status_filter: Optional[str] = Query(None, alias="status"),
    content_type: Optional[str] = Query(None, alias="contentType"),
    creator_id: Optional[str] = Query(None, alias="creatorId"),
    db: Session = Depends(get_db)
):
    query = db.query(ContentApprovalItem)

    if status_filter:
        query = query.filter(ContentApprovalItem.status == status_filter)

    if content_type:
        query = query.filter(ContentApprovalItem.content_type == content_type)

    if creator_id:
        query = query.filter(ContentApprovalItem.creator_id == creator_id)

    items = query.all()
    return {
        "success": True,
        "count": len(items),
        "approvalQueue": [item.to_dict() for item in items]
    }


@router.get("/{item_id}")
def get_approval_by_id(item_id: str, db: Session = Depends(get_db)):
    item = db.query(ContentApprovalItem).filter(ContentApprovalItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval item not found.")
    return {
        "success": True,
        "item": item.to_dict()
    }


@router.post("/submit")
def submit_for_approval(req: ApprovalSubmitRequest, db: Session = Depends(get_db)):
    new_item = ContentApprovalItem(
        id=f"apprv-{int(time.time() * 1000)}",
        content_type=req.contentType,
        content_id=req.contentId,
        title=req.title,
        category_or_subject=req.categoryOrSubject,
        creator_id=req.creatorId or "user-mentor",
        creator_name=req.creatorName or "Mentor",
        creator_role=req.creatorRole or "Mentor",
        status="submitted",
        submission_date=datetime.utcnow().isoformat(),
        feedback_history=[]
    )

    # Update underlying content status
    if req.contentType == "course":
        course = db.query(Course).filter(Course.id == req.contentId).first()
        if course:
            course.status = "submitted"

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "success": True,
        "message": "Content submitted for admin review.",
        "approvalItem": new_item.to_dict()
    }


@router.post("/{item_id}/action")
def process_approval_action(item_id: str, req: ApprovalActionRequest, db: Session = Depends(get_db)):
    item = db.query(ContentApprovalItem).filter(ContentApprovalItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approval item not found.")

    action = req.action.lower()
    now_str = datetime.utcnow().isoformat()
    reviewer = req.reviewerName or "Platform Admin"

    feedback_entry = {
        "date": now_str,
        "adminName": reviewer,
        "action": action,
        "feedback": req.feedback or ""
    }

    history = list(item.feedback_history or [])
    history.append(feedback_entry)
    item.feedback_history = history
    item.reviewed_date = now_str
    item.reviewed_by = reviewer

    if action == "approve":
        item.status = "approved"
        if req.publishImmediately:
            item.status = "published"
        if item.content_type == "course":
            course = db.query(Course).filter(Course.id == item.content_id).first()
            if course:
                course.status = "published" if req.publishImmediately else "approved"

    elif action == "reject":
        item.status = "rejected"
        item.rejection_reason = req.feedback or "Does not meet editorial guidelines."
        if item.content_type == "course":
            course = db.query(Course).filter(Course.id == item.content_id).first()
            if course:
                course.status = "rejected"
                course.rejection_feedback = req.feedback

    elif action in ["request_changes", "request-changes", "requested_changes"]:
        item.status = "changes_requested"
        if item.content_type == "course":
            course = db.query(Course).filter(Course.id == item.content_id).first()
            if course:
                course.status = "changes_requested"
                course.rejection_feedback = req.feedback

    elif action == "publish":
        item.status = "published"
        if item.content_type == "course":
            course = db.query(Course).filter(Course.id == item.content_id).first()
            if course:
                course.status = "published"

    db.commit()

    return {
        "success": True,
        "message": f"Approval status updated to {item.status}.",
        "approvalItem": item.to_dict()
    }


@router.post("/{item_id}/approve")
def approve_item(item_id: str, db: Session = Depends(get_db)):
    req = ApprovalActionRequest(action="approve", publishImmediately=True)
    return process_approval_action(item_id, req, db)


@router.post("/{item_id}/reject")
def reject_item(item_id: str, req: ApprovalActionRequest, db: Session = Depends(get_db)):
    req.action = "reject"
    return process_approval_action(item_id, req, db)


@router.post("/{item_id}/request-changes")
def request_changes_item(item_id: str, req: ApprovalActionRequest, db: Session = Depends(get_db)):
    req.action = "request_changes"
    return process_approval_action(item_id, req, db)

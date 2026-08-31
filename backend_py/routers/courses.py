import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.course import Course
from backend_py.models.quiz import Quiz
from backend_py.models.assignment import Assignment
from backend_py.models.feedback import CourseFeedback
from backend_py.models.enrolled_student import EnrolledStudent
from backend_py.models.reward import DiscountVoucher
from backend_py.models.user import User
from backend_py.models.progress import UserWatchProgress
from backend_py.schemas.course import CourseCreate, CourseUpdate, EnrollRequest, CourseStatusUpdateRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("")
def get_courses(
    category: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    instructor_id: Optional[str] = Query(None, alias="instructorId"),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Course)

    if category and category != "All":
        query = query.filter(Course.category.ilike(f"%{category}%"))

    if level and level != "All Levels":
        query = query.filter(Course.level == level)

    if instructor_id:
        query = query.filter(Course.instructor_id == instructor_id)

    if status_filter:
        query = query.filter(Course.status == status_filter)

    if search:
        s = f"%{search}%"
        query = query.filter((Course.title.ilike(s)) | (Course.description.ilike(s)) | (Course.subtitle.ilike(s)))

    courses = query.all()
    return {
        "success": True,
        "count": len(courses),
        "courses": [c.to_dict() for c in courses]
    }


@router.get("/user/{user_id}/enrolled")
def get_user_enrolled_courses(user_id: str, db: Session = Depends(get_db)):
    enrollments = db.query(EnrolledStudent).filter(EnrolledStudent.user_id == user_id).all()
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all() if course_ids else []

    return {
        "success": True,
        "count": len(courses),
        "enrollments": [e.to_dict() for e in enrollments],
        "courses": [c.to_dict() for c in courses]
    }


@router.get("/{course_id}")
def get_course_by_id(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    quizzes = db.query(Quiz).filter(Quiz.course_id == course_id).all()
    assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()
    feedback = db.query(CourseFeedback).filter(CourseFeedback.course_id == course_id).all()

    c_dict = course.to_dict()
    c_dict["quizzes"] = [q.to_dict() for q in quizzes]
    c_dict["assignments"] = [a.to_dict() for a in assignments]
    c_dict["feedback"] = [f.to_dict() for f in feedback]

    return {
        "success": True,
        "course": c_dict
    }


@router.post("")
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    instructor_id = current_user.id if current_user else (data.instructorId or "user-mentor")
    instructor = db.query(User).filter(User.id == instructor_id).first()

    instructor_name = instructor.name if instructor else (data.instructorName or "Instructor")
    instructor_avatar = instructor.avatar if instructor else data.instructorAvatar
    instructor_bio = instructor.bio if instructor else (data.instructorBio or "Verified LMS Educator")

    new_course = Course(
        id=f"course-{int(time.time() * 1000)}",
        title=data.title,
        subtitle=data.subtitle or "",
        description=data.description or "",
        category=data.category or "General",
        price=data.price or 0.0,
        discounted_price=data.discountedPrice,
        instructor_id=instructor_id,
        instructor_name=instructor_name,
        instructor_avatar=instructor_avatar,
        instructor_bio=instructor_bio,
        thumbnail_url=data.thumbnailUrl or "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        level=data.level or "Beginner",
        rating=5.0,
        reviews_count=0,
        students_count=0,
        modules=data.modules or [],
        reels=data.reels or [],
        learning_outcomes=data.learningOutcomes or [],
        status=data.status or "submitted",
        duration_hours=data.durationHours or 5.0,
        lessons_count=len(data.reels or []) or len(data.modules or []) or 5,
        reels_count=len(data.reels or []) or 5,
        quizzes_count=data.quizzesCount or 1,
        assignments_count=data.assignmentsCount or 1,
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return {
        "success": True,
        "message": "Course created successfully.",
        "course": new_course.to_dict()
    }


@router.put("/{course_id}")
def update_course(course_id: str, updates: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    update_dict = updates.model_dump(exclude_unset=True)
    field_map = {
        "discountedPrice": "discounted_price",
        "thumbnailUrl": "thumbnail_url",
        "learningOutcomes": "learning_outcomes",
        "durationHours": "duration_hours"
    }

    for k, v in update_dict.items():
        attr = field_map.get(k, k)
        if hasattr(course, attr):
            setattr(course, attr, v)

    db.commit()
    db.refresh(course)

    return {
        "success": True,
        "message": "Course updated successfully.",
        "course": course.to_dict()
    }


@router.delete("/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    db.delete(course)
    db.commit()

    return {
        "success": True,
        "message": "Course deleted successfully."
    }


@router.post("/{course_id}/status")
def update_course_status(course_id: str, req: CourseStatusUpdateRequest, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    course.status = req.status
    if req.feedback:
        course.rejection_feedback = req.feedback

    db.commit()

    return {
        "success": True,
        "message": f"Course status updated to {req.status}.",
        "course": course.to_dict()
    }


@router.post("/{course_id}/toggle-publish")
def toggle_publish_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    course.status = "published" if course.status != "published" else "draft"
    db.commit()

    return {
        "success": True,
        "status": course.status,
        "message": f"Course {'published' if course.status == 'published' else 'unpublished'}."
    }


@router.post("/{course_id}/enroll")
def enroll_in_course(
    course_id: str,
    req: EnrollRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    user_id = current_user.id if current_user else "user-student"
    user = db.query(User).filter(User.id == user_id).first()

    existing_enrollment = db.query(EnrolledStudent).filter(
        EnrolledStudent.user_id == user_id,
        EnrolledStudent.course_id == course_id
    ).first()

    if existing_enrollment:
        return {
            "success": True,
            "message": "Already enrolled in this course.",
            "enrollment": existing_enrollment.to_dict()
        }

    # Discount calculation
    final_price = course.price
    if req.discountCode:
        voucher = db.query(DiscountVoucher).filter(
            DiscountVoucher.code == req.discountCode.strip(),
            DiscountVoucher.is_used == False
        ).first()
        if voucher:
            discount = (final_price * voucher.discount_percent) / 100
            final_price = max(0.0, final_price - discount)
            voucher.is_used = True

    new_enrollment = EnrolledStudent(
        id=f"enroll-{int(time.time() * 1000)}",
        user_id=user_id,
        user_name=user.name if user else "Student",
        user_email=user.email if user else "student@lms.ai",
        user_avatar=user.avatar if user else None,
        course_id=course_id,
        course_title=course.title,
        enrolled_at=datetime.utcnow().isoformat(),
        progress_percent=0,
        last_active=datetime.utcnow().isoformat(),
        quiz_average=0.0
    )
    db.add(new_enrollment)

    # Update course and user
    course.students_count = (course.students_count or 0) + 1
    if user:
        enrolled = list(user.enrolled_course_ids or [])
        if course_id not in enrolled:
            enrolled.append(course_id)
            user.enrolled_course_ids = enrolled

    db.commit()

    return {
        "success": True,
        "message": f"Successfully enrolled in '{course.title}'!",
        "finalPrice": final_price,
        "enrollment": new_enrollment.to_dict()
    }


@router.get("/{course_id}/students")
def get_course_students(course_id: str, db: Session = Depends(get_db)):
    students = db.query(EnrolledStudent).filter(EnrolledStudent.course_id == course_id).all()
    return {
        "success": True,
        "count": len(students),
        "students": [s.to_dict() for s in students]
    }


@router.post("/{course_id}/reels/{reel_id}/complete")
def mark_course_reel_completed(
    course_id: str,
    reel_id: str,
    user_id: Optional[str] = Query(None, alias="userId"),
    db: Session = Depends(get_db)
):
    target_user_id = user_id or "user-student"
    progress = db.query(UserWatchProgress).filter(UserWatchProgress.user_id == target_user_id).first()

    if not progress:
        progress = UserWatchProgress(user_id=target_user_id, watched_learn_reel_ids=[], completed_course_reels={course_id: [reel_id]})
        db.add(progress)
    else:
        completed_dict = dict(progress.completed_course_reels or {})
        course_reels = list(completed_dict.get(course_id, []))
        if reel_id not in course_reels:
            course_reels.append(reel_id)
            completed_dict[course_id] = course_reels
            progress.completed_course_reels = completed_dict

    # Update student enrollment progress
    enrollment = db.query(EnrolledStudent).filter(
        EnrolledStudent.user_id == target_user_id,
        EnrolledStudent.course_id == course_id
    ).first()
    if enrollment:
        course = db.query(Course).filter(Course.id == course_id).first()
        total_reels = len(course.reels or []) if course else 5
        completed_count = len(progress.completed_course_reels.get(course_id, []))
        pct = min(100, int((completed_count / max(1, total_reels)) * 100))
        enrollment.progress_percent = pct
        enrollment.last_active = datetime.utcnow().isoformat()
        if pct >= 100 and not enrollment.completed_at:
            enrollment.completed_at = datetime.utcnow().isoformat()

    db.commit()

    return {
        "success": True,
        "message": "Course reel marked completed.",
        "completedReels": progress.completed_course_reels.get(course_id, [])
    }


@router.get("/{course_id}/progress/{user_id}")
def get_course_progress(course_id: str, user_id: str, db: Session = Depends(get_db)):
    progress = db.query(UserWatchProgress).filter(UserWatchProgress.user_id == user_id).first()
    completed_reels = (progress.completed_course_reels.get(course_id, []) if progress and progress.completed_course_reels else [])

    return {
        "success": True,
        "courseId": course_id,
        "userId": user_id,
        "completedReels": completed_reels,
        "count": len(completed_reels)
    }

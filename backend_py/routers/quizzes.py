import time
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.quiz import Quiz
from backend_py.models.user import User
from backend_py.schemas.quiz import QuizCreate, QuizSubmitRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.get("")
def get_quizzes(
    course_id: Optional[str] = Query(None, alias="courseId"),
    module_id: Optional[str] = Query(None, alias="moduleId"),
    db: Session = Depends(get_db)
):
    query = db.query(Quiz)
    if course_id:
        query = query.filter(Quiz.course_id == course_id)
    if module_id:
        query = query.filter(Quiz.module_id == module_id)

    quizzes = query.all()
    return {
        "success": True,
        "count": len(quizzes),
        "quizzes": [q.to_dict() for q in quizzes]
    }


@router.get("/{quiz_id}")
def get_quiz_by_id(quiz_id: str, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")
    return {
        "success": True,
        "quiz": quiz.to_dict()
    }


@router.post("")
def create_quiz(data: QuizCreate, db: Session = Depends(get_db)):
    new_quiz = Quiz(
        id=f"quiz-{int(time.time() * 1000)}",
        course_id=data.courseId,
        course_title=data.courseTitle,
        module_id=data.moduleId,
        module_title=data.moduleTitle,
        title=data.title,
        difficulty=data.difficulty or "Beginner",
        total_marks=data.totalMarks or 100,
        passing_percentage=data.passingPercentage or 80.0,
        questions=data.questions or [],
        created_at=datetime.utcnow().isoformat()
    )

    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return {
        "success": True,
        "message": "Quiz created successfully.",
        "quiz": new_quiz.to_dict()
    }


@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: str, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    db.delete(quiz)
    db.commit()

    return {
        "success": True,
        "message": "Quiz deleted successfully."
    }


@router.post("/{quiz_id}/submit")
def submit_quiz(
    quiz_id: str,
    req: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    questions = quiz.questions or []
    total_q = len(questions)
    if total_q == 0:
        return {
            "success": True,
            "passed": True,
            "scorePercentage": 100,
            "correctCount": 0,
            "totalQuestions": 0
        }

    correct_count = 0
    for idx, q in enumerate(questions):
        correct_idx = q.get("correctIndex", 0)
        # answers can be keyed by index or question id
        user_ans = req.answers.get(str(idx))
        if user_ans is None and q.get("id"):
            user_ans = req.answers.get(str(q.get("id")))

        if user_ans is not None and int(user_ans) == correct_idx:
            correct_count += 1

    pct = round((correct_count / total_q) * 100, 1)
    passed = pct >= (quiz.passing_percentage or 80.0)

    target_user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == target_user_id).first()

    if user and passed:
        user.points = (user.points or 0) + 50
        user.xp = (user.xp or 0) + 100

        act = {
            "id": f"act-{int(time.time() * 1000)}",
            "type": "quiz",
            "title": f"Completed Quiz: {quiz.title}",
            "description": f"Scored {pct}% ({correct_count}/{total_q} correct)",
            "timestamp": "Just now",
            "scoreOrPoints": "+100 XP"
        }
        activity = list(user.recent_activity or [])
        activity.insert(0, act)
        user.recent_activity = activity[:15]

        db.commit()

    return {
        "success": True,
        "scorePercentage": pct,
        "correctCount": correct_count,
        "totalQuestions": total_q,
        "passed": passed,
        "passingPercentage": quiz.passing_percentage
    }

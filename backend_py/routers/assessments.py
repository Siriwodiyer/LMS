import time
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.assessment import AssessmentResult
from backend_py.models.reel import Reel
from backend_py.models.user import User
from backend_py.models.reward import BadgeDefinition, DiscountVoucher
from backend_py.models.settings import AdminSettingsModel
from backend_py.models.notification import NotificationItem
from backend_py.models.progress import UserWatchProgress
from backend_py.schemas.assessment import AssessmentSubmitRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.get("/eligibility/{user_id}")
def check_eligibility(user_id: str, db: Session = Depends(get_db)):
    settings = db.query(AdminSettingsModel).filter(AdminSettingsModel.id == "default").first()
    min_assessments = settings.mentor_eligibility_min_assessments if settings else 3
    min_score = settings.mentor_eligibility_min_score if settings else 80
    avg_score_req = settings.mentor_eligibility_avg_score if settings else 85

    results = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == user_id,
        AssessmentResult.passed == True
    ).all()

    completed_count = len(results)
    avg_score = round(sum(r.score_percentage for r in results) / completed_count, 1) if completed_count > 0 else 0.0

    is_eligible = (completed_count >= min_assessments) and (avg_score >= avg_score_req)

    reason = "Meets all criteria to apply as an official mentor!" if is_eligible else (
        f"Requires {min_assessments} passed assessments (current: {completed_count}) with avg score >= {avg_score_req}% (current: {avg_score}%)."
    )

    # Update user flag
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_eligible_for_mentor = is_eligible
        db.commit()

    return {
        "success": True,
        "userId": user_id,
        "isEligible": is_eligible,
        "completedCount": completed_count,
        "averageScore": avg_score,
        "minAssessmentsRequired": min_assessments,
        "avgScoreRequired": avg_score_req,
        "reason": reason
    }


@router.get("/questions")
def get_assessment_questions(db: Session = Depends(get_db)):
    reels = db.query(Reel).filter(Reel.is_published == True).limit(6).all()
    questions = []

    for r in reels:
        r_questions = r.questions or []
        for q in r_questions:
            q_copy = dict(q)
            q_copy["reelId"] = r.id
            q_copy["reelTitle"] = r.title
            questions.append(q_copy)

    # Default fallback questions if reels don't have enough embedded questions
    if len(questions) < 6:
        defaults = [
            {
                "id": "q-eval-1",
                "category": "Architecture",
                "type": "mcq",
                "prompt": "What is the primary advantage of Structured Outputs in LLM integrations?",
                "options": [
                    "Guarantees JSON Schema compliance",
                    "Reduces server RAM by 50%",
                    "Bypasses token limitations",
                    "Removes prompt length constraints"
                ],
                "correctIndex": 0,
                "explanation": "Structured Outputs strictly adhere to defined schemas.",
                "difficulty": "Intermediate",
                "marks": 10
            },
            {
                "id": "q-eval-2",
                "category": "React 19",
                "type": "mcq",
                "prompt": "Which hook in React 19 simplifies async state transitions without manual isPending flags?",
                "options": [
                    "useTransition / useActionState",
                    "useDeferredCallback",
                    "useAsyncEffect",
                    "useSubscription"
                ],
                "correctIndex": 0,
                "explanation": "useActionState handles pending state and errors automatically.",
                "difficulty": "Intermediate",
                "marks": 10
            },
            {
                "id": "q-eval-3",
                "category": "Databases",
                "type": "mcq",
                "prompt": "Why are B+ Tree indexes preferred over Hash indexes for relational query execution?",
                "options": [
                    "They support efficient range queries (<, >, BETWEEN)",
                    "They use zero disk storage",
                    "They do not require memory locks",
                    "They execute in O(1) time always"
                ],
                "correctIndex": 0,
                "explanation": "B+ Trees maintain sorted order allowing logarithmic range scans.",
                "difficulty": "Advanced",
                "marks": 10
            },
            {
                "id": "q-eval-4",
                "category": "Systems",
                "type": "mcq",
                "prompt": "What role does Raft / Paxos play in distributed database architectures?",
                "options": [
                    "Consensus and replicated state machine synchronization",
                    "Lossless image compression",
                    "Frontend CSS bundling",
                    "Automated unit testing"
                ],
                "correctIndex": 0,
                "explanation": "Raft ensures distributed consensus across replica nodes.",
                "difficulty": "Advanced",
                "marks": 10
            },
            {
                "id": "q-eval-5",
                "category": "Python",
                "type": "mcq",
                "prompt": "In FastAPI, what library is utilized for request data validation and schema serialization?",
                "options": [
                    "Pydantic v2",
                    "Django ORM",
                    "Flask-RESTful",
                    "Celery"
                ],
                "correctIndex": 0,
                "explanation": "FastAPI is deeply integrated with Pydantic for high-performance validation.",
                "difficulty": "Beginner",
                "marks": 10
            },
            {
                "id": "q-eval-6",
                "category": "Performance",
                "type": "mcq",
                "prompt": "What does Connection Pooling prevent in high-throughput backend services?",
                "options": [
                    "Repeated TCP handshake overhead and socket exhaustion",
                    "SQL injection attacks",
                    "Frontend rendering lag",
                    "Git merge conflicts"
                ],
                "correctIndex": 0,
                "explanation": "Connection pooling reuses active database sockets efficiently.",
                "difficulty": "Intermediate",
                "marks": 10
            }
        ]
        questions.extend(defaults[len(questions):6])

    return {
        "success": True,
        "count": len(questions[:6]),
        "questions": questions[:6]
    }


@router.post("/submit")
def submit_assessment(
    req: AssessmentSubmitRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    target_user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == target_user_id).first()

    questions = req.customQuestions or []
    if not questions:
        # Load default assessment questions
        resp = get_assessment_questions(db)
        questions = resp.get("questions", [])

    total_q = len(questions)
    correct_count = 0

    for idx, q in enumerate(questions):
        correct_idx = q.get("correctIndex", 0)
        user_ans = req.answers.get(str(idx))
        if user_ans is None and q.get("id"):
            user_ans = req.answers.get(str(q.get("id")))

        if user_ans is not None and int(user_ans) == correct_idx:
            correct_count += 1

    pct = round((correct_count / max(1, total_q)) * 100, 1)

    settings = db.query(AdminSettingsModel).filter(AdminSettingsModel.id == "default").first()
    threshold = settings.passing_score_threshold if settings else 80
    passed = pct >= threshold

    # Reward generation
    badge_def = db.query(BadgeDefinition).first()
    badge_data = {
        "id": f"badge-earned-{int(time.time())}",
        "title": "Micro-Assessment Master",
        "description": f"Scored {pct}% on 6-Reel assessment",
        "icon": "⚡",
        "unlockedAt": datetime.utcnow().isoformat(),
        "rarity": "rare" if pct < 95 else "legendary"
    } if passed else None

    voucher_data = {
        "id": f"vouch-{int(time.time())}",
        "code": f"PROPASS{int(pct)}",
        "discountPercent": 35 if pct >= 90 else 25,
        "description": f"{35 if pct >= 90 else 25}% off any Course (Earned via Assessment Pass)",
        "expiresAt": (datetime.utcnow() + timedelta(days=30)).isoformat(),
        "isUsed": False
    } if passed else None

    rewards = {
        "points": (correct_count * 50) + (100 if passed else 0),
        "badge": badge_data,
        "voucher": voucher_data,
        "goodie": "Pro Micro-Certificate" if passed else None
    }

    result = AssessmentResult(
        id=f"asmt-{int(time.time() * 1000)}",
        user_id=target_user_id,
        reel_ids=["reel-1", "reel-2", "reel-3", "reel-4", "reel-5", "reel-6"],
        total_questions=total_q,
        correct_count=correct_count,
        score_percentage=pct,
        passed=passed,
        completed_at=datetime.utcnow().isoformat(),
        rewards_earned=rewards
    )
    db.add(result)

    if user:
        user.points = (user.points or 0) + rewards["points"]
        user.xp = (user.xp or 0) + (rewards["points"] * 2)

        if passed and badge_data:
            user_badges = list(user.badges or [])
            user_badges.append(badge_data)
            user.badges = user_badges

        if passed and voucher_data:
            user_vouchers = list(user.discount_vouchers or [])
            user_vouchers.append(voucher_data)
            user.discount_vouchers = user_vouchers

        # Activity log
        act = {
            "id": f"act-{int(time.time() * 1000)}",
            "type": "quiz",
            "title": f"Completed 6-Reel Assessment ({'Passed' if passed else 'Failed'})",
            "description": f"Scored {pct}% ({correct_count}/{total_q} correct)",
            "timestamp": "Just now",
            "scoreOrPoints": f"+{rewards['points']} pts"
        }
        activity = list(user.recent_activity or [])
        activity.insert(0, act)
        user.recent_activity = activity[:15]

        # Notification
        notif = NotificationItem(
            id=f"notif-{int(time.time() * 1000)}",
            user_id=target_user_id,
            title="Assessment Result",
            message=f"You scored {pct}% on your assessment. {'Congratulations, you passed!' if passed else 'Keep practicing and try again!'}",
            type="assessment",
            read=False,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(notif)

    db.commit()
    db.refresh(result)

    return {
        "success": True,
        "result": result.to_dict(),
        "passed": passed,
        "scorePercentage": pct,
        "rewardsEarned": rewards
    }


@router.get("/history/{user_id}")
def get_assessment_history(user_id: str, db: Session = Depends(get_db)):
    results = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == user_id
    ).order_by(AssessmentResult.completed_at.desc()).all()

    return {
        "success": True,
        "count": len(results),
        "history": [r.to_dict() for r in results]
    }

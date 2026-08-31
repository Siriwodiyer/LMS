from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.user import User
from backend_py.models.reel import Reel
from backend_py.models.assessment import AssessmentResult
from backend_py.schemas.ai import AIInsightsRequest, AIChatRequest, AIQuizGenRequest
from backend_py.middleware.auth import get_current_user_optional

router = APIRouter(prefix="/ai", tags=["AI Tutor & Insights"])


@router.post("/insights")
def get_ai_insights(
    req: AIInsightsRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    target_user_id = req.userId or (current_user.id if current_user else "user-student")
    user = db.query(User).filter(User.id == target_user_id).first()
    assessments = db.query(AssessmentResult).filter(AssessmentResult.user_id == target_user_id).all()
    reels = db.query(Reel).filter(Reel.is_published == True).limit(4).all()

    completed_asmt = len(assessments)

    strong_topics = [
        {"topic": "Full-Stack Architecture & React 19", "score": 94},
        {"topic": "SQL & Relational Indexing", "score": 88},
        {"topic": "RESTful API Design & FastAPI", "score": 92}
    ]

    weak_topics = [
        {"topic": "Distributed Consensus (Raft/Paxos)", "score": 64},
        {"topic": "Dynamic Programming & Tree Traversals", "score": 70}
    ]

    learning_tips = [
        "Focus 15 mins daily on Binary Search Tree balance rotations to boost algorithmic problem-solving speed.",
        "Your streak is currently high! Take the next 6-reel micro-assessment to unlock your 30% course discount voucher.",
        "Watch the Distributed Systems Reel before attempting the next system design quiz."
    ]

    predicted_date = (datetime.utcnow() + timedelta(days=14 if completed_asmt < 3 else 3)).strftime("%B %d, %Y")

    return {
        "success": True,
        "insights": {
            "strongTopics": strong_topics,
            "weakTopics": weak_topics,
            "recommendedReels": [r.to_dict() for r in reels],
            "learningTips": learning_tips,
            "predictedEligibilityDate": predicted_date,
            "assessmentsPassed": len([a for a in assessments if a.passed]),
            "readinessScore": min(98, 60 + (completed_asmt * 12))
        }
    }


@router.post("/chat")
def ai_tutor_chat(req: AIChatRequest, db: Session = Depends(get_db)):
    msg = req.message.lower()

    # Intelligent contextual responses
    if "mentor" in msg or "eligibility" in msg:
        reply = (
            "To become an official verified mentor, you need to pass at least 3 six-reel micro-assessments "
            "with an average score of 85% or higher. Once eligible, you can submit your portfolio in the Mentor Portal for admin approval!"
        )
    elif "reel" in msg or "assessment" in msg:
        reply = (
            "The micro-learning assessment unlocks after watching all 6 vertical educational reels in the Learn tab. "
            "Scoring 80%+ awards bonus XP, platform badges, and exclusive course discount vouchers!"
        )
    elif "course" in msg or "enroll" in msg:
        reply = (
            "You can explore comprehensive masterclasses in the Courses section. Each course includes vertical video reels, "
            "interactive coding assignments, module quizzes, and direct mentor reviews."
        )
    elif "python" in msg or "fastapi" in msg or "sql" in msg or "mysql" in msg:
        reply = (
            "Our LMS backend is powered by Python FastAPI and MySQL via SQLAlchemy ORM. "
            "It provides high-throughput async processing, automatic Swagger OpenAPI docs at `/docs`, and strict Pydantic v2 data validation!"
        )
    else:
        reply = (
            f"Hello! I am your AI Learning Assistant. You asked: '{req.message}'. "
            "I can help you review difficult quiz questions, summarize educational reels, recommend next courses, or prepare for mentor eligibility. How can I assist you further today?"
        )

    return {
        "success": True,
        "reply": reply,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.post("/generate-quiz")
def generate_ai_quiz(req: AIQuizGenRequest):
    topic = req.topic
    difficulty = req.difficulty or "Beginner"

    questions = [
        {
            "id": f"ai-q-1",
            "category": topic,
            "type": "mcq",
            "prompt": f"In {topic}, what is considered a best practice for high scalability and modular design?",
            "options": [
                "Layered architecture with loose coupling and dependency injection",
                "Writing all logic into a single monolithic file",
                "Hardcoding all credentials in client source code",
                "Disabling database indexes and caching"
            ],
            "correctIndex": 0,
            "explanation": "Separation of concerns and dependency inversion provide maximum maintainability.",
            "difficulty": difficulty,
            "marks": 10
        },
        {
            "id": f"ai-q-2",
            "category": topic,
            "type": "mcq",
            "prompt": f"Which metric is most critical when optimizing performance in {topic} workloads?",
            "options": [
                "p99 latency, throughput (RPS), and resource utilization",
                "Number of comments in the code repository",
                "Length of function names",
                "Screen brightness during development"
            ],
            "correctIndex": 0,
            "explanation": "P99 latency and throughput directly measure user experience and system capacity.",
            "difficulty": difficulty,
            "marks": 10
        }
    ]

    return {
        "success": True,
        "topic": topic,
        "difficulty": difficulty,
        "questions": questions
    }

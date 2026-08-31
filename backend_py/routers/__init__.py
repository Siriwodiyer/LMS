from fastapi import APIRouter
from backend_py.routers.auth import router as auth_router
from backend_py.routers.users import router as users_router
from backend_py.routers.reels import router as reels_router
from backend_py.routers.courses import router as courses_router
from backend_py.routers.quizzes import router as quizzes_router
from backend_py.routers.assignments import router as assignments_router
from backend_py.routers.assessments import router as assessments_router
from backend_py.routers.approvals import router as approvals_router
from backend_py.routers.mentors import router as mentors_router
from backend_py.routers.rewards import router as rewards_router
from backend_py.routers.feedback import router as feedback_router
from backend_py.routers.comments import router as comments_router
from backend_py.routers.notifications import router as notifications_router
from backend_py.routers.analytics import router as analytics_router
from backend_py.routers.settings import router as settings_router
from backend_py.routers.ai import router as ai_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(reels_router)
api_router.include_router(courses_router)
api_router.include_router(quizzes_router)
api_router.include_router(assignments_router)
api_router.include_router(assessments_router)
api_router.include_router(approvals_router)
api_router.include_router(mentors_router)
api_router.include_router(rewards_router)
api_router.include_router(feedback_router)
api_router.include_router(comments_router)
api_router.include_router(notifications_router)
api_router.include_router(analytics_router)
api_router.include_router(settings_router)
api_router.include_router(ai_router)

__all__ = ["api_router"]

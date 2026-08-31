from backend_py.schemas.common import ApiResponse, ErrorResponse
from backend_py.schemas.auth import RegisterRequest, LoginRequest, SwitchRoleRequest, TokenData, AuthResponse
from backend_py.schemas.user import UserUpdate, UserActivityCreate
from backend_py.schemas.reel import ReelCreate, ReelUpdate, QuestionItem
from backend_py.schemas.course import CourseCreate, CourseUpdate, EnrollRequest, CourseStatusUpdateRequest
from backend_py.schemas.quiz import QuizCreate, QuizSubmitRequest
from backend_py.schemas.assignment import AssignmentCreate, SubmissionCreate, GradeSubmissionRequest
from backend_py.schemas.assessment import AssessmentSubmitRequest
from backend_py.schemas.approval import ApprovalSubmitRequest, ApprovalActionRequest
from backend_py.schemas.mentor import MentorApplicationCreate, MentorReviewRequest, MentorResubmitRequest
from backend_py.schemas.reward import BadgeDefCreate, BadgeDefUpdate, RedeemVoucherRequest
from backend_py.schemas.feedback import CourseFeedbackCreate, PlatformFeedbackCreate
from backend_py.schemas.comment import CommentCreate, FlagCommentRequest
from backend_py.schemas.settings import AdminSettingsUpdate
from backend_py.schemas.ai import AIInsightsRequest, AIChatRequest, AIQuizGenRequest

__all__ = [
    "ApiResponse",
    "ErrorResponse",
    "RegisterRequest",
    "LoginRequest",
    "SwitchRoleRequest",
    "TokenData",
    "AuthResponse",
    "UserUpdate",
    "UserActivityCreate",
    "ReelCreate",
    "ReelUpdate",
    "QuestionItem",
    "CourseCreate",
    "CourseUpdate",
    "EnrollRequest",
    "CourseStatusUpdateRequest",
    "QuizCreate",
    "QuizSubmitRequest",
    "AssignmentCreate",
    "SubmissionCreate",
    "GradeSubmissionRequest",
    "AssessmentSubmitRequest",
    "ApprovalSubmitRequest",
    "ApprovalActionRequest",
    "MentorApplicationCreate",
    "MentorReviewRequest",
    "MentorResubmitRequest",
    "BadgeDefCreate",
    "BadgeDefUpdate",
    "RedeemVoucherRequest",
    "CourseFeedbackCreate",
    "PlatformFeedbackCreate",
    "CommentCreate",
    "FlagCommentRequest",
    "AdminSettingsUpdate",
    "AIInsightsRequest",
    "AIChatRequest",
    "AIQuizGenRequest"
]

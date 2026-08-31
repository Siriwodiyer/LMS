from sqlalchemy import Column, String, Integer, Float, JSON
from backend_py.database import Base


class AdminSettingsModel(Base):
    __tablename__ = "admin_settings"

    id = Column(String(50), primary_key=True, default="default")
    passing_score_threshold = Column(Integer, default=80)
    reels_per_assessment = Column(Integer, default=6)
    points_per_correct_answer = Column(Integer, default=50)
    streak_bonus_multiplier = Column(Float, default=1.5)
    mentor_eligibility_min_assessments = Column(Integer, default=3)
    mentor_eligibility_min_score = Column(Integer, default=80)
    mentor_eligibility_avg_score = Column(Integer, default=85)

    def to_dict(self):
        return {
            "passingScoreThreshold": self.passing_score_threshold,
            "reelsPerAssessment": self.reels_per_assessment,
            "pointsPerCorrectAnswer": self.points_per_correct_answer,
            "streakBonusMultiplier": self.streak_bonus_multiplier,
            "mentorEligibilityMinAssessments": self.mentor_eligibility_min_assessments,
            "mentorEligibilityMinScore": self.mentor_eligibility_min_score,
            "mentorEligibilityAvgScore": self.mentor_eligibility_avg_score
        }


class AdminAnalyticsModel(Base):
    __tablename__ = "admin_analytics"

    id = Column(String(50), primary_key=True, default="default")
    total_users = Column(Integer, default=1240)
    active_users_dau = Column(Integer, default=480)
    active_users_mau = Column(Integer, default=1120)
    total_reels_watched = Column(Integer, default=15600)
    total_assessments_completed = Column(Integer, default=3420)
    overall_pass_rate = Column(Float, default=84.5)
    total_courses = Column(Integer, default=18)
    approved_mentors_count = Column(Integer, default=12)
    pending_course_reviews = Column(Integer, default=3)
    total_marketplace_revenue = Column(Float, default=14250.0)
    daily_engagement = Column(JSON, default=list)
    user_growth_data = Column(JSON, default=list)
    course_performance_data = Column(JSON, default=list)
    content_performance_data = Column(JSON, default=list)
    learning_analytics_data = Column(JSON, default=dict)

    def to_dict(self):
        return {
            "totalUsers": self.total_users,
            "activeUsersDAU": self.active_users_dau,
            "activeUsersMAU": self.active_users_mau,
            "totalReelsWatched": self.total_reels_watched,
            "totalAssessmentsCompleted": self.total_assessments_completed,
            "overallPassRate": self.overall_pass_rate,
            "totalCourses": self.total_courses,
            "approvedMentorsCount": self.approved_mentors_count,
            "pendingCourseReviews": self.pending_course_reviews,
            "totalMarketplaceRevenue": self.total_marketplace_revenue,
            "dailyEngagement": self.daily_engagement or [],
            "userGrowthData": self.user_growth_data or [],
            "coursePerformanceData": self.course_performance_data or [],
            "contentPerformanceData": self.content_performance_data or [],
            "learningAnalyticsData": self.learning_analytics_data or {}
        }

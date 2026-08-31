import os
import json
from sqlalchemy.orm import Session
from backend_py.database import get_engine, get_session_factory, Base
from backend_py.models import (
    User,
    Reel,
    Course,
    Quiz,
    Assignment,
    ContentApprovalItem,
    MentorApplication,
    BadgeDefinition,
    DiscountVoucher,
    CourseFeedback,
    PlatformFeedbackItem,
    Comment,
    NotificationItem,
    EnrolledStudent,
    AdminSettingsModel,
    AdminAnalyticsModel,
    UserWatchProgress
)


def load_seed_json():
    json_path = os.path.join(os.path.dirname(__file__), "initial_seed.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def seed_database(db: Session = None, force_reset: bool = False):
    """Populate database tables with initial seed data if empty or forced."""
    engine = get_engine()
    Base.metadata.create_all(bind=engine)

    session_factory = get_session_factory()
    close_after = False
    if db is None:
        db = session_factory()
        close_after = True

    try:
        # Check if users already exist
        user_count = db.query(User).count()
        if user_count > 0 and not force_reset:
            print(f"[Seeder] Database already contains {user_count} users. Skipping seeding.")
            return

        if force_reset:
            print("[Seeder] Force reset requested. Clearing tables...")
            db.query(User).delete()
            db.query(Reel).delete()
            db.query(Course).delete()
            db.query(Quiz).delete()
            db.query(Assignment).delete()
            db.query(ContentApprovalItem).delete()
            db.query(MentorApplication).delete()
            db.query(BadgeDefinition).delete()
            db.query(DiscountVoucher).delete()
            db.query(CourseFeedback).delete()
            db.query(PlatformFeedbackItem).delete()
            db.query(Comment).delete()
            db.query(NotificationItem).delete()
            db.query(EnrolledStudent).delete()
            db.query(AdminSettingsModel).delete()
            db.query(AdminAnalyticsModel).delete()
            db.query(UserWatchProgress).delete()
            db.commit()

        data = load_seed_json()
        if not data:
            print("[Seeder Warning] No initial_seed.json data found.")
            return

        print("[Seeder] Populating database tables...")

        # 1. Seed Users
        for u in data.get("INITIAL_USERS", []):
            user = User(
                id=u["id"],
                name=u["name"],
                email=u["email"],
                password=u.get("password", "password123"),
                avatar=u.get("avatar"),
                role=u.get("role", "student"),
                status=u.get("status", "active"),
                points=u.get("points", 500),
                xp=u.get("xp", 1000),
                streak_days=u.get("streakDays", 1),
                level=u.get("level", 1),
                is_eligible_for_mentor=u.get("isEligibleForMentor", False),
                mentor_application_id=u.get("mentorApplicationId"),
                bio=u.get("bio"),
                specialty=u.get("specialty"),
                assigned_mentor_id=u.get("assignedMentorId"),
                assigned_mentor_name=u.get("assignedMentorName"),
                assigned_learner_ids=u.get("assignedLearnerIds", []),
                enrolled_course_ids=u.get("enrolledCourseIds", []),
                completed_course_ids=u.get("completedCourseIds", []),
                badges=u.get("badges", []),
                discount_vouchers=u.get("discountVouchers", []),
                weekly_hours=u.get("weeklyHours", [1.0, 1.5, 0.5, 2.0, 1.0, 0.0, 0.0]),
                recent_activity=u.get("recentActivity", []),
                registered_at=u.get("registeredAt"),
                last_active=u.get("lastActive"),
                total_learning_hours=u.get("totalLearningHours", 0.0),
                quiz_average=u.get("quizAverage", 0.0),
                completed_lessons_count=u.get("completedLessonsCount", 0),
                reels_watched_total=u.get("reelsWatchedTotal", 0),
                assignments_completed_count=u.get("assignmentsCompletedCount", 0)
            )
            db.merge(user)

        # 2. Seed Reels
        for r in data.get("INITIAL_REELS", []):
            reel = Reel(
                id=r["id"],
                title=r["title"],
                description=r.get("description", ""),
                category=r.get("category", "General"),
                subject=r.get("subject"),
                topic=r.get("topic"),
                course_id=r.get("courseId"),
                course_title=r.get("courseTitle"),
                video_url=r.get("videoUrl", ""),
                thumbnail_url=r.get("thumbnailUrl", ""),
                creator_id=r.get("creatorId", "user-mentor"),
                creator_name=r.get("creatorName", "Instructor"),
                creator_avatar=r.get("creatorAvatar"),
                creator_role=r.get("creatorRole", "Mentor"),
                difficulty=r.get("difficulty", "Beginner"),
                duration_seconds=r.get("durationSeconds", 60),
                likes_count=r.get("likesCount", 0),
                comments_count=r.get("commentsCount", 0),
                shares_count=r.get("sharesCount", 0),
                views_count=r.get("viewsCount", 0),
                is_published=r.get("isPublished", True),
                tags=r.get("tags", []),
                questions=r.get("questions", []),
                created_at=r.get("createdAt")
            )
            db.merge(reel)

        # 3. Seed Courses
        for c in data.get("INITIAL_COURSES", []):
            course = Course(
                id=c["id"],
                title=c["title"],
                subtitle=c.get("subtitle", ""),
                description=c.get("description", ""),
                category=c.get("category", "General"),
                price=c.get("price", 0.0),
                discounted_price=c.get("discountedPrice"),
                instructor_id=c.get("instructorId", "user-mentor"),
                instructor_name=c.get("instructorName", "Instructor"),
                instructor_avatar=c.get("instructorAvatar"),
                instructor_bio=c.get("instructorBio", ""),
                thumbnail_url=c.get("thumbnailUrl", ""),
                level=c.get("level", "Beginner"),
                rating=c.get("rating", 5.0),
                reviews_count=c.get("reviewsCount", 0),
                students_count=c.get("studentsCount", 0),
                modules=c.get("modules", []),
                reels=c.get("reels", []),
                learning_outcomes=c.get("learningOutcomes", []),
                status=c.get("status", "published"),
                rejection_feedback=c.get("rejectionFeedback"),
                submitted_at=c.get("submittedAt"),
                created_at=c.get("createdAt"),
                duration_hours=c.get("durationHours", 5.0),
                progress_percent=c.get("progressPercent", 0),
                last_lesson_title=c.get("lastLessonTitle"),
                lessons_count=c.get("lessonsCount", 5),
                reels_count=c.get("reelsCount", 5),
                quizzes_count=c.get("quizzesCount", 1),
                assignments_count=c.get("assignmentsCount", 1)
            )
            db.merge(course)

        # 4. Seed Quizzes
        for q in data.get("INITIAL_QUIZZES", []):
            quiz = Quiz(
                id=q["id"],
                course_id=q["courseId"],
                course_title=q.get("courseTitle"),
                module_id=q["moduleId"],
                module_title=q.get("moduleTitle"),
                title=q["title"],
                difficulty=q.get("difficulty", "Beginner"),
                total_marks=q.get("totalMarks", 100),
                passing_percentage=q.get("passingPercentage", 80.0),
                questions=q.get("questions", []),
                created_at=q.get("createdAt")
            )
            db.merge(quiz)

        # 5. Seed Assignments
        for a in data.get("INITIAL_ASSIGNMENTS", []):
            assignment = Assignment(
                id=a["id"],
                course_id=a["courseId"],
                course_title=a.get("courseTitle"),
                module_id=a["moduleId"],
                module_title=a.get("moduleTitle"),
                title=a["title"],
                instructions=a.get("instructions", ""),
                due_date=a.get("dueDate", ""),
                max_marks=a.get("maxMarks", 100),
                submission_type=a.get("submissionType", "code"),
                submissions=a.get("submissions", []),
                created_at=a.get("createdAt")
            )
            db.merge(assignment)

        # 6. Seed Approval Queue
        for ap in data.get("INITIAL_APPROVAL_QUEUE", []):
            approval = ContentApprovalItem(
                id=ap["id"],
                content_type=ap["contentType"],
                content_id=ap["contentId"],
                title=ap["title"],
                category_or_subject=ap["categoryOrSubject"],
                creator_id=ap["creatorId"],
                creator_name=ap["creatorName"],
                creator_role=ap.get("creatorRole", "Mentor"),
                status=ap.get("status", "submitted"),
                submission_date=ap.get("submissionDate"),
                reviewed_date=ap.get("reviewedDate"),
                reviewed_by=ap.get("reviewedBy"),
                rejection_reason=ap.get("rejectionReason"),
                feedback_history=ap.get("feedbackHistory", [])
            )
            db.merge(approval)

        # 7. Seed Mentor Applications
        for ma in data.get("INITIAL_MENTOR_APPLICATIONS", []):
            app_item = MentorApplication(
                id=ma["id"],
                user_id=ma["userId"],
                applicant_name=ma["applicantName"],
                applicant_email=ma["applicantEmail"],
                applicant_avatar=ma.get("applicantAvatar"),
                expertise=ma["expertise"],
                skills=ma.get("skills", []),
                experience_years=ma.get("experienceYears", 0),
                bio=ma.get("bio", ""),
                portfolio_url=ma.get("portfolioUrl"),
                assessments_completed=ma.get("assessmentsCompleted", 0),
                average_score=ma.get("averageScore", 0.0),
                status=ma.get("status", "submitted"),
                submission_date=ma.get("submissionDate"),
                reviewed_date=ma.get("reviewedDate"),
                reviewed_by=ma.get("reviewedBy"),
                admin_feedback=ma.get("adminFeedback")
            )
            db.merge(app_item)

        # 8. Seed Badges & Vouchers
        for b in data.get("INITIAL_BADGE_DEFINITIONS", []):
            bd = BadgeDefinition(
                id=b["id"],
                title=b["title"],
                description=b["description"],
                icon=b.get("icon", "🏆"),
                rarity=b.get("rarity", "common"),
                condition_type=b.get("conditionType", "quiz_score"),
                condition_course_id=b.get("conditionCourseId"),
                condition_threshold=b.get("conditionThreshold", 0.0),
                condition_text=b.get("conditionText", ""),
                is_active=b.get("isActive", True),
                earned_count=b.get("earnedCount", 0),
                created_at=b.get("createdAt")
            )
            db.merge(bd)

        for v in data.get("INITIAL_VOUCHERS", []):
            voucher = DiscountVoucher(
                id=v["id"],
                code=v["code"],
                discount_percent=v.get("discountPercent", 20),
                description=v.get("description", ""),
                expires_at=v.get("expiresAt", ""),
                is_used=v.get("isUsed", False)
            )
            db.merge(voucher)

        # 9. Seed Course & Platform Feedback
        for fb in data.get("INITIAL_COURSE_FEEDBACK", []):
            course_fb = CourseFeedback(
                id=fb["id"],
                course_id=fb["courseId"],
                course_title=fb.get("courseTitle"),
                user_id=fb["userId"],
                user_name=fb["userName"],
                user_avatar=fb.get("userAvatar"),
                rating=fb.get("rating", 5.0),
                comment=fb["comment"],
                created_at=fb.get("createdAt")
            )
            db.merge(course_fb)

        for pfb in data.get("INITIAL_PLATFORM_FEEDBACK", []):
            plat_fb = PlatformFeedbackItem(
                id=pfb["id"],
                user_id=pfb["userId"],
                user_name=pfb["userName"],
                rating=pfb.get("rating", 5.0),
                category=pfb.get("category", "General"),
                comment=pfb["comment"],
                created_at=pfb.get("createdAt")
            )
            db.merge(plat_fb)

        # 10. Seed Comments
        for cm in data.get("INITIAL_COMMENTS", []):
            comment = Comment(
                id=cm["id"],
                reel_id=cm["reelId"],
                user_id=cm["userId"],
                user_name=cm["userName"],
                user_avatar=cm.get("userAvatar"),
                content=cm["content"],
                likes=cm.get("likes", 0),
                is_flagged=cm.get("isFlagged", False),
                flag_reason=cm.get("flagReason"),
                created_at=cm.get("createdAt")
            )
            db.merge(comment)

        # 11. Seed Notifications & Enrolled Students
        for n in data.get("INITIAL_NOTIFICATIONS", []):
            notif = NotificationItem(
                id=n["id"],
                user_id=n["userId"],
                title=n["title"],
                message=n["message"],
                type=n.get("type", "system"),
                read=n.get("read", False),
                action_url=n.get("actionUrl"),
                created_at=n.get("createdAt")
            )
            db.merge(notif)

        for es in data.get("INITIAL_ENROLLED_STUDENTS", []):
            enrollment = EnrolledStudent(
                id=es["id"],
                user_id=es["userId"],
                user_name=es["userName"],
                user_email=es["userEmail"],
                user_avatar=es.get("userAvatar"),
                course_id=es["courseId"],
                course_title=es["courseTitle"],
                enrolled_at=es.get("enrolledAt"),
                progress_percent=es.get("progressPercent", 0),
                completed_at=es.get("completedAt"),
                last_active=es.get("lastActive"),
                quiz_average=es.get("quizAverage", 0.0)
            )
            db.merge(enrollment)

        # 12. Seed Admin Settings & Analytics
        admin_set = data.get("INITIAL_ADMIN_SETTINGS", {})
        db.merge(AdminSettingsModel(
            id="default",
            passing_score_threshold=admin_set.get("passingScoreThreshold", 80),
            reels_per_assessment=admin_set.get("reelsPerAssessment", 6),
            points_per_correct_answer=admin_set.get("pointsPerCorrectAnswer", 50),
            streak_bonus_multiplier=admin_set.get("streakBonusMultiplier", 1.5),
            mentor_eligibility_min_assessments=admin_set.get("mentorEligibilityMinAssessments", 3),
            mentor_eligibility_min_score=admin_set.get("mentorEligibilityMinScore", 80),
            mentor_eligibility_avg_score=admin_set.get("mentorEligibilityAvgScore", 85)
        ))

        analytics_data = data.get("INITIAL_ANALYTICS", {})
        db.merge(AdminAnalyticsModel(
            id="default",
            total_users=analytics_data.get("totalUsers", 1240),
            active_users_dau=analytics_data.get("activeUsersDAU", 480),
            active_users_mau=analytics_data.get("activeUsersMAU", 1120),
            total_reels_watched=analytics_data.get("totalReelsWatched", 15600),
            total_assessments_completed=analytics_data.get("totalAssessmentsCompleted", 3420),
            overall_pass_rate=analytics_data.get("overallPassRate", 84.5),
            total_courses=analytics_data.get("totalCourses", 18),
            approved_mentors_count=analytics_data.get("approvedMentorsCount", 12),
            pending_course_reviews=analytics_data.get("pendingCourseReviews", 3),
            total_marketplace_revenue=analytics_data.get("totalMarketplaceRevenue", 14250.0),
            daily_engagement=analytics_data.get("dailyEngagement", []),
            user_growth_data=analytics_data.get("userGrowthData", []),
            course_performance_data=analytics_data.get("coursePerformanceData", []),
            content_performance_data=analytics_data.get("contentPerformanceData", []),
            learning_analytics_data=analytics_data.get("learningAnalyticsData", {})
        ))

        # 13. Seed User Watch Progress for demo student
        completed_reels = data.get("INITIAL_COMPLETED_COURSE_REELS", {})
        db.merge(UserWatchProgress(
            user_id="user-student",
            watched_learn_reel_ids=["reel-1", "reel-2", "reel-3", "reel-4", "reel-5", "reel-6"],
            completed_course_reels=completed_reels
        ))

        db.commit()
        print("[Seeder] Successfully populated database with all seed records!")

    except Exception as e:
        db.rollback()
        print(f"[Seeder Error] Failed to seed database: {e}")
    finally:
        if close_after:
            db.close()


if __name__ == "__main__":
    seed_database(force_reset=True)

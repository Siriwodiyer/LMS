import { connectMongoDB, disconnectMongoDB } from '../config/mongo.js';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  ReelModel,
  CourseModel,
  QuizModel,
  AssignmentModel,
  ApprovalModel,
  MentorApplicationModel,
  NotificationModel,
  CourseFeedbackModel,
  PlatformFeedbackModel,
  CommentModel,
  BadgeDefinitionModel,
  DiscountVoucherModel,
  AdminSettingsModel
} from '../models/index.js';
import {
  INITIAL_USERS,
  INITIAL_REELS,
  INITIAL_COURSES,
  INITIAL_QUIZZES,
  INITIAL_ASSIGNMENTS,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_MENTOR_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COURSE_FEEDBACK,
  INITIAL_PLATFORM_FEEDBACK,
  INITIAL_COMMENTS,
  INITIAL_BADGE_DEFINITIONS,
  INITIAL_VOUCHERS,
  INITIAL_ADMIN_SETTINGS
} from './seedData.js';

export const seedMongoDB = async (wipeClean = true): Promise<void> => {
  try {
    console.log('🚀 [MongoDB Seeder] Starting database provisioning...');
    await connectMongoDB();

    if (wipeClean) {
      console.log('🧹 [MongoDB Seeder] Clearing existing collections for clean seed...');
      await Promise.all([
        UserModel.deleteMany({}),
        ReelModel.deleteMany({}),
        CourseModel.deleteMany({}),
        QuizModel.deleteMany({}),
        AssignmentModel.deleteMany({}),
        ApprovalModel.deleteMany({}),
        MentorApplicationModel.deleteMany({}),
        NotificationModel.deleteMany({}),
        CourseFeedbackModel.deleteMany({}),
        PlatformFeedbackModel.deleteMany({}),
        CommentModel.deleteMany({}),
        BadgeDefinitionModel.deleteMany({}),
        DiscountVoucherModel.deleteMany({}),
        AdminSettingsModel.deleteMany({})
      ]);
    }

    console.log('🌱 [MongoDB Seeder] Populating collections with LMS baseline data...');

    // 1. Users with bcrypt hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      INITIAL_USERS.map(async u => {
        const passwordToHash = u.password || (u.role === 'admin' ? 'admin123' : 'password123');
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);
        return {
          ...u,
          password: hashedPassword
        };
      })
    );
    const seededUsers = await UserModel.insertMany(usersWithHashedPasswords);
    console.log(`  ✓ Inserted ${seededUsers.length} Users (passwords hashed with bcrypt)`);

    // 2. Reels (6 Vertical Learn Reels)
    const seededReels = await ReelModel.insertMany(INITIAL_REELS);
    console.log(`  ✓ Inserted ${seededReels.length} Educational Reels (including 6-reel micro-assessments)`);

    // 3. Courses
    const seededCourses = await CourseModel.insertMany(INITIAL_COURSES);
    console.log(`  ✓ Inserted ${seededCourses.length} Courses with vertical lesson reels`);

    // 4. Quizzes & Assignments
    const seededQuizzes = await QuizModel.insertMany(INITIAL_QUIZZES);
    const seededAssignments = await AssignmentModel.insertMany(INITIAL_ASSIGNMENTS);
    console.log(`  ✓ Inserted ${seededQuizzes.length} Quizzes and ${seededAssignments.length} Assignments`);

    // 5. Approvals & Applications
    const seededApprovals = await ApprovalModel.insertMany(INITIAL_APPROVAL_QUEUE);
    const seededMentorApps = await MentorApplicationModel.insertMany(INITIAL_MENTOR_APPLICATIONS);
    console.log(`  ✓ Inserted ${seededApprovals.length} Approval Queue items and ${seededMentorApps.length} Mentor Applications`);

    // 6. Badges & Vouchers
    const seededBadges = await BadgeDefinitionModel.insertMany(INITIAL_BADGE_DEFINITIONS);
    const seededVouchers = await DiscountVoucherModel.insertMany(INITIAL_VOUCHERS);
    console.log(`  ✓ Inserted ${seededBadges.length} Badge Definitions and ${seededVouchers.length} Discount Vouchers`);

    // 7. Feedback, Comments, Notifications
    const seededNotifications = await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);
    const seededComments = await CommentModel.insertMany(INITIAL_COMMENTS);
    const seededCourseFeedback = await CourseFeedbackModel.insertMany(INITIAL_COURSE_FEEDBACK);
    const seededPlatformFeedback = await PlatformFeedbackModel.insertMany(INITIAL_PLATFORM_FEEDBACK);
    console.log(`  ✓ Inserted ${seededNotifications.length} Notifications, ${seededComments.length} Comments, and ${seededCourseFeedback.length + seededPlatformFeedback.length} Feedback items`);

    // 8. Admin Settings
    await AdminSettingsModel.findOneAndUpdate(
      { key: 'global_settings' },
      { key: 'global_settings', ...INITIAL_ADMIN_SETTINGS },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Configured Platform Governance Settings (6-reel lock, 80% passing threshold)`);

    console.log('✨ [MongoDB Seeder] Successfully seeded all collections into MongoDB Atlas!');
  } catch (error: any) {
    console.error('❌ [MongoDB Seeder Error]:', error);
    throw error;
  }
};

// Direct script execution
seedMongoDB()
  .then(async () => {
    await disconnectMongoDB();
    console.log('🏁 [MongoDB Seeder] Completed successfully.');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Fatal Seeder Error:', err);
    await disconnectMongoDB();
    process.exit(1);
  });


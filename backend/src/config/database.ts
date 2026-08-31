import fs from 'fs';
import path from 'path';
import {
  User,
  Reel,
  Course,
  Quiz,
  Assignment,
  ContentApprovalItem,
  MentorApplication,
  CourseFeedback,
  PlatformFeedbackItem,
  Comment,
  EnrolledStudent,
  NotificationItem,
  Badge,
  BadgeDefinition,
  DiscountVoucher,
  AdminAnalytics,
  AdminSettings,
  AssessmentResult
} from '../types/index.js';
import {
  INITIAL_USERS,
  INITIAL_REELS,
  INITIAL_COURSES,
  INITIAL_QUIZZES,
  INITIAL_ASSIGNMENTS,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_MENTOR_APPLICATIONS,
  INITIAL_COURSE_FEEDBACK,
  INITIAL_PLATFORM_FEEDBACK,
  INITIAL_COMMENTS,
  INITIAL_ENROLLED_STUDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES,
  INITIAL_BADGE_DEFINITIONS,
  INITIAL_VOUCHERS,
  INITIAL_ANALYTICS,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_COMPLETED_COURSE_REELS
} from '../seed/seedData.js';
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
  AdminSettingsModel,
  AssessmentResultModel
} from '../models/index.js';
import { isMongoConnected } from './mongo.js';

export interface DatabaseSchema {
  users: User[];
  reels: Reel[];
  courses: Course[];
  quizzes: Quiz[];
  assignments: Assignment[];
  approvalQueue: ContentApprovalItem[];
  mentorApplications: MentorApplication[];
  courseFeedback: CourseFeedback[];
  platformFeedback: PlatformFeedbackItem[];
  comments: Comment[];
  enrolledStudents: EnrolledStudent[];
  notifications: NotificationItem[];
  badges: Badge[];
  badgeDefinitions: BadgeDefinition[];
  vouchers: DiscountVoucher[];
  analytics: AdminAnalytics;
  adminSettings: AdminSettings;
  assessmentHistory: AssessmentResult[];
  watchedLearnReelIds: Record<string, string[]>; // userId -> reelIds
  completedCourseReels: Record<string, Record<string, string[]>>; // userId -> { courseId -> reelIds }
}

class Database {
  private filePath: string;
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    const rawPath = process.env.DB_PATH || './data/lms.json';
    this.filePath = path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), rawPath);
    this.data = this.loadOrInitialize();
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      reels: JSON.parse(JSON.stringify(INITIAL_REELS)),
      courses: JSON.parse(JSON.stringify(INITIAL_COURSES)),
      quizzes: JSON.parse(JSON.stringify(INITIAL_QUIZZES)),
      assignments: JSON.parse(JSON.stringify(INITIAL_ASSIGNMENTS)),
      approvalQueue: JSON.parse(JSON.stringify(INITIAL_APPROVAL_QUEUE)),
      mentorApplications: JSON.parse(JSON.stringify(INITIAL_MENTOR_APPLICATIONS)),
      courseFeedback: JSON.parse(JSON.stringify(INITIAL_COURSE_FEEDBACK)),
      platformFeedback: JSON.parse(JSON.stringify(INITIAL_PLATFORM_FEEDBACK)),
      comments: JSON.parse(JSON.stringify(INITIAL_COMMENTS)),
      enrolledStudents: JSON.parse(JSON.stringify(INITIAL_ENROLLED_STUDENTS)),
      notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
      badges: JSON.parse(JSON.stringify(INITIAL_BADGES)),
      badgeDefinitions: JSON.parse(JSON.stringify(INITIAL_BADGE_DEFINITIONS)),
      vouchers: JSON.parse(JSON.stringify(INITIAL_VOUCHERS)),
      analytics: JSON.parse(JSON.stringify(INITIAL_ANALYTICS)),
      adminSettings: JSON.parse(JSON.stringify(INITIAL_ADMIN_SETTINGS)),
      assessmentHistory: [],
      watchedLearnReelIds: {
        'user-student': ['reel-1', 'reel-2', 'reel-3', 'reel-4', 'reel-5', 'reel-6']
      },
      completedCourseReels: {
        'user-student': JSON.parse(JSON.stringify(INITIAL_COMPLETED_COURSE_REELS))
      }
    };
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        const defaults = this.getDefaultData();
        return {
          ...defaults,
          ...parsed,
          adminSettings: { ...defaults.adminSettings, ...(parsed.adminSettings || {}) },
          analytics: { ...defaults.analytics, ...(parsed.analytics || {}) }
        };
      } else {
        const initial = this.getDefaultData();
        fs.writeFileSync(this.filePath, JSON.stringify(initial, null, 2), 'utf-8');
        return initial;
      }
    } catch (err) {
      console.error('Failed to load database from', this.filePath, err);
      return this.getDefaultData();
    }
  }

  public async syncWithMongoDB(): Promise<void> {
    if (!isMongoConnected()) return;

    try {
      console.log('🔄 [MongoDB Sync] Synchronizing state with MongoDB Atlas...');
      const [
        mongoUsers,
        mongoReels,
        mongoCourses,
        mongoQuizzes,
        mongoAssignments,
        mongoApprovals,
        mongoMentorApps,
        mongoNotifications,
        mongoCourseFeedback,
        mongoPlatformFeedback,
        mongoComments,
        mongoBadgeDefs,
        mongoVouchers,
        mongoSettings,
        mongoAssessments
      ] = await Promise.all([
        UserModel.find({}).lean(),
        ReelModel.find({}).lean(),
        CourseModel.find({}).lean(),
        QuizModel.find({}).lean(),
        AssignmentModel.find({}).lean(),
        ApprovalModel.find({}).lean(),
        MentorApplicationModel.find({}).lean(),
        NotificationModel.find({}).lean(),
        CourseFeedbackModel.find({}).lean(),
        PlatformFeedbackModel.find({}).lean(),
        CommentModel.find({}).lean(),
        BadgeDefinitionModel.find({}).lean(),
        DiscountVoucherModel.find({}).lean(),
        AdminSettingsModel.findOne({ key: 'global_settings' }).lean(),
        AssessmentResultModel.find({}).lean()
      ]);

      if (mongoUsers.length > 0) this.data.users = mongoUsers as any;
      if (mongoReels.length > 0) this.data.reels = mongoReels as any;
      if (mongoCourses.length > 0) this.data.courses = mongoCourses as any;
      if (mongoQuizzes.length > 0) this.data.quizzes = mongoQuizzes as any;
      if (mongoAssignments.length > 0) this.data.assignments = mongoAssignments as any;
      if (mongoApprovals.length > 0) this.data.approvalQueue = mongoApprovals as any;
      if (mongoMentorApps.length > 0) this.data.mentorApplications = mongoMentorApps as any;
      if (mongoNotifications.length > 0) this.data.notifications = mongoNotifications as any;
      if (mongoCourseFeedback.length > 0) this.data.courseFeedback = mongoCourseFeedback as any;
      if (mongoPlatformFeedback.length > 0) this.data.platformFeedback = mongoPlatformFeedback as any;
      if (mongoComments.length > 0) this.data.comments = mongoComments as any;
      if (mongoBadgeDefs.length > 0) this.data.badgeDefinitions = mongoBadgeDefs as any;
      if (mongoVouchers.length > 0) this.data.vouchers = mongoVouchers as any;
      if (mongoSettings) this.data.adminSettings = { ...this.data.adminSettings, ...(mongoSettings as any) };
      if (mongoAssessments.length > 0) this.data.assessmentHistory = mongoAssessments as any;

      this.save();
      console.log(`✅ [MongoDB Sync] Synced ${this.data.users.length} users, ${this.data.courses.length} courses, and ${this.data.reels.length} reels from MongoDB Atlas.`);
    } catch (err) {
      console.error('⚠️ [MongoDB Sync Error] Could not pull collections from Atlas:', err);
    }
  }

  public save(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  public resetToSeed(): void {
    this.data = this.getDefaultData();
    this.save();
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    const norm = email.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === norm);
  }

  public insertUser(user: User): User {
    this.data.users.unshift(user);
    this.save();
    if (isMongoConnected()) {
      UserModel.findOneAndUpdate({ id: user.id }, user, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo user insert error:', err)
      );
    }
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      UserModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo user update error:', err)
      );
    }
    return this.data.users[index];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      if (isMongoConnected()) {
        UserModel.deleteOne({ id }).catch(err => console.error('Mongo user delete error:', err));
      }
      return true;
    }
    return false;
  }

  // --- Reels ---
  public getReels(): Reel[] {
    return this.data.reels;
  }

  public getReelById(id: string): Reel | undefined {
    return this.data.reels.find(r => r.id === id);
  }

  public insertReel(reel: Reel): Reel {
    this.data.reels.unshift(reel);
    this.save();
    if (isMongoConnected()) {
      ReelModel.findOneAndUpdate({ id: reel.id }, reel, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo reel insert error:', err)
      );
    }
    return reel;
  }

  public updateReel(id: string, updates: Partial<Reel>): Reel | undefined {
    const index = this.data.reels.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    this.data.reels[index] = { ...this.data.reels[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      ReelModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo reel update error:', err)
      );
    }
    return this.data.reels[index];
  }

  public deleteReel(id: string): boolean {
    const initialLen = this.data.reels.length;
    this.data.reels = this.data.reels.filter(r => r.id !== id);
    if (this.data.reels.length !== initialLen) {
      this.save();
      if (isMongoConnected()) {
        ReelModel.deleteOne({ id }).catch(err => console.error('Mongo reel delete error:', err));
      }
      return true;
    }
    return false;
  }

  // --- Courses ---
  public getCourses(): Course[] {
    return this.data.courses;
  }

  public getCourseById(id: string): Course | undefined {
    return this.data.courses.find(c => c.id === id);
  }

  public insertCourse(course: Course): Course {
    this.data.courses.unshift(course);
    this.save();
    if (isMongoConnected()) {
      CourseModel.findOneAndUpdate({ id: course.id }, course, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo course insert error:', err)
      );
    }
    return course;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const index = this.data.courses.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.data.courses[index] = { ...this.data.courses[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      CourseModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo course update error:', err)
      );
    }
    return this.data.courses[index];
  }

  public deleteCourse(id: string): boolean {
    const initialLen = this.data.courses.length;
    this.data.courses = this.data.courses.filter(c => c.id !== id);
    if (this.data.courses.length !== initialLen) {
      this.save();
      if (isMongoConnected()) {
        CourseModel.deleteOne({ id }).catch(err => console.error('Mongo course delete error:', err));
      }
      return true;
    }
    return false;
  }

  // --- Enrolled Students ---
  public getEnrolledStudents(courseId?: string, userId?: string): EnrolledStudent[] {
    let list = this.data.enrolledStudents;
    if (courseId) {
      list = list.filter(e => e.courseId === courseId);
    }
    if (userId) {
      list = list.filter(e => e.userId === userId);
    }
    return list;
  }

  public insertEnrolledStudent(item: EnrolledStudent): EnrolledStudent {
    this.data.enrolledStudents.unshift(item);
    this.save();
    return item;
  }

  public updateEnrolledStudent(id: string, updates: Partial<EnrolledStudent>): EnrolledStudent | undefined {
    const index = this.data.enrolledStudents.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    this.data.enrolledStudents[index] = { ...this.data.enrolledStudents[index], ...updates };
    this.save();
    return this.data.enrolledStudents[index];
  }

  // --- Quizzes ---
  public getQuizzes(courseId?: string): Quiz[] {
    if (courseId) {
      return this.data.quizzes.filter(q => q.courseId === courseId);
    }
    return this.data.quizzes;
  }

  public getQuizById(id: string): Quiz | undefined {
    return this.data.quizzes.find(q => q.id === id);
  }

  public insertQuiz(quiz: Quiz): Quiz {
    this.data.quizzes.unshift(quiz);
    this.save();
    if (isMongoConnected()) {
      QuizModel.findOneAndUpdate({ id: quiz.id }, quiz, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo quiz insert error:', err)
      );
    }
    return quiz;
  }

  public updateQuiz(id: string, updates: Partial<Quiz>): Quiz | undefined {
    const index = this.data.quizzes.findIndex(q => q.id === id);
    if (index === -1) return undefined;
    this.data.quizzes[index] = { ...this.data.quizzes[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      QuizModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo quiz update error:', err)
      );
    }
    return this.data.quizzes[index];
  }

  public deleteQuiz(id: string): boolean {
    const initialLen = this.data.quizzes.length;
    this.data.quizzes = this.data.quizzes.filter(q => q.id !== id);
    if (this.data.quizzes.length !== initialLen) {
      this.save();
      if (isMongoConnected()) {
        QuizModel.deleteOne({ id }).catch(err => console.error('Mongo quiz delete error:', err));
      }
      return true;
    }
    return false;
  }

  // --- Assignments ---
  public getAssignments(courseId?: string): Assignment[] {
    if (courseId) {
      return this.data.assignments.filter(a => a.courseId === courseId);
    }
    return this.data.assignments;
  }

  public getAssignmentById(id: string): Assignment | undefined {
    return this.data.assignments.find(a => a.id === id);
  }

  public insertAssignment(assignment: Assignment): Assignment {
    this.data.assignments.unshift(assignment);
    this.save();
    if (isMongoConnected()) {
      AssignmentModel.findOneAndUpdate({ id: assignment.id }, assignment, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo assignment insert error:', err)
      );
    }
    return assignment;
  }

  public updateAssignment(id: string, updates: Partial<Assignment>): Assignment | undefined {
    const index = this.data.assignments.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    this.data.assignments[index] = { ...this.data.assignments[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      AssignmentModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo assignment update error:', err)
      );
    }
    return this.data.assignments[index];
  }

  public deleteAssignment(id: string): boolean {
    const initialLen = this.data.assignments.length;
    this.data.assignments = this.data.assignments.filter(a => a.id !== id);
    if (this.data.assignments.length !== initialLen) {
      this.save();
      if (isMongoConnected()) {
        AssignmentModel.deleteOne({ id }).catch(err => console.error('Mongo assignment delete error:', err));
      }
      return true;
    }
    return false;
  }

  // --- Approval Queue ---
  public getApprovals(status?: string): ContentApprovalItem[] {
    if (status) {
      return this.data.approvalQueue.filter(a => a.status === status);
    }
    return this.data.approvalQueue;
  }

  public getApprovalQueue(status?: string): ContentApprovalItem[] {
    return this.getApprovals(status);
  }

  public getApprovalById(id: string): ContentApprovalItem | undefined {
    return this.data.approvalQueue.find(a => a.id === id);
  }

  public getApprovalItemById(id: string): ContentApprovalItem | undefined {
    return this.getApprovalById(id);
  }

  public insertApproval(item: ContentApprovalItem): ContentApprovalItem {
    this.data.approvalQueue.unshift(item);
    this.save();
    if (isMongoConnected()) {
      ApprovalModel.findOneAndUpdate({ id: item.id }, item, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo approval insert error:', err)
      );
    }
    return item;
  }

  public insertApprovalItem(item: ContentApprovalItem): ContentApprovalItem {
    return this.insertApproval(item);
  }

  public updateApproval(id: string, updates: Partial<ContentApprovalItem>): ContentApprovalItem | undefined {
    const index = this.data.approvalQueue.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    this.data.approvalQueue[index] = { ...this.data.approvalQueue[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      ApprovalModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo approval update error:', err)
      );
    }
    return this.data.approvalQueue[index];
  }

  public updateApprovalItem(id: string, updates: Partial<ContentApprovalItem>): ContentApprovalItem | undefined {
    return this.updateApproval(id, updates);
  }

  // --- Mentor Applications ---
  public getMentorApplications(status?: string): MentorApplication[] {
    if (status) {
      return this.data.mentorApplications.filter(m => m.status === status);
    }
    return this.data.mentorApplications;
  }

  public getMentorApplicationById(id: string): MentorApplication | undefined {
    return this.data.mentorApplications.find(m => m.id === id);
  }

  public insertMentorApplication(app: MentorApplication): MentorApplication {
    this.data.mentorApplications.unshift(app);
    this.save();
    if (isMongoConnected()) {
      MentorApplicationModel.findOneAndUpdate({ id: app.id }, app, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo mentor app insert error:', err)
      );
    }
    return app;
  }

  public updateMentorApplication(id: string, updates: Partial<MentorApplication>): MentorApplication | undefined {
    const index = this.data.mentorApplications.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    this.data.mentorApplications[index] = { ...this.data.mentorApplications[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      MentorApplicationModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo mentor app update error:', err)
      );
    }
    return this.data.mentorApplications[index];
  }

  // --- Feedback ---
  public getCourseFeedback(courseId?: string): CourseFeedback[] {
    if (courseId) {
      return this.data.courseFeedback.filter(f => f.courseId === courseId);
    }
    return this.data.courseFeedback;
  }

  public insertCourseFeedback(feedback: CourseFeedback): CourseFeedback {
    this.data.courseFeedback.unshift(feedback);
    this.save();
    if (isMongoConnected()) {
      CourseFeedbackModel.findOneAndUpdate({ id: feedback.id }, feedback, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo course feedback insert error:', err)
      );
    }
    return feedback;
  }

  public getPlatformFeedback(): PlatformFeedbackItem[] {
    return this.data.platformFeedback;
  }

  public insertPlatformFeedback(feedback: PlatformFeedbackItem): PlatformFeedbackItem {
    this.data.platformFeedback.unshift(feedback);
    this.save();
    if (isMongoConnected()) {
      PlatformFeedbackModel.findOneAndUpdate({ id: feedback.id }, feedback, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo platform feedback insert error:', err)
      );
    }
    return feedback;
  }

  // --- Comments ---
  public getComments(reelId?: string): Comment[] {
    if (reelId) {
      return this.data.comments.filter(c => c.reelId === reelId);
    }
    return this.data.comments;
  }

  public insertComment(comment: Comment): Comment {
    this.data.comments.unshift(comment);
    this.save();
    if (isMongoConnected()) {
      CommentModel.findOneAndUpdate({ id: comment.id }, comment, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo comment insert error:', err)
      );
    }
    return comment;
  }

  public deleteComment(id: string): boolean {
    const initialLen = this.data.comments.length;
    this.data.comments = this.data.comments.filter(c => c.id !== id);
    if (this.data.comments.length !== initialLen) {
      this.save();
      if (isMongoConnected()) {
        CommentModel.deleteOne({ id }).catch(err => console.error('Mongo comment delete error:', err));
      }
      return true;
    }
    return false;
  }

  public updateComment(id: string, updates: Partial<Comment>): Comment | undefined {
    const index = this.data.comments.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.data.comments[index] = { ...this.data.comments[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      CommentModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo comment update error:', err)
      );
    }
    return this.data.comments[index];
  }

  // --- Notifications ---
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.data.notifications.filter(n => n.userId === userId || n.userId === 'user-student');
    }
    return this.data.notifications;
  }

  public insertNotification(notif: NotificationItem): NotificationItem {
    this.data.notifications.unshift(notif);
    this.save();
    if (isMongoConnected()) {
      NotificationModel.findOneAndUpdate({ id: notif.id }, notif, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo notification insert error:', err)
      );
    }
    return notif;
  }

  public updateNotification(id: string, updates: Partial<NotificationItem>): NotificationItem | undefined {
    const index = this.data.notifications.findIndex(n => n.id === id);
    if (index === -1) return undefined;
    this.data.notifications[index] = { ...this.data.notifications[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      NotificationModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo notification update error:', err)
      );
    }
    return this.data.notifications[index];
  }

  public markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      if (isMongoConnected()) {
        NotificationModel.findOneAndUpdate({ id }, { $set: { read: true } }).catch(err =>
          console.error('Mongo notification update error:', err)
        );
      }
      return true;
    }
    return false;
  }

  public clearAllNotifications(userId?: string): void {
    this.data.notifications.forEach(n => {
      if (!userId || n.userId === userId) {
        n.read = true;
      }
    });
    this.save();
    if (isMongoConnected()) {
      const query = userId ? { userId } : {};
      NotificationModel.updateMany(query, { $set: { read: true } }).catch(err =>
        console.error('Mongo notification mark all read error:', err)
      );
    }
  }

  public clearUserNotifications(userId?: string): void {
    this.clearAllNotifications(userId);
  }

  // --- Badges & Vouchers ---
  public getBadges(): Badge[] {
    return this.data.badges;
  }

  public getBadgeDefinitions(): BadgeDefinition[] {
    return this.data.badgeDefinitions;
  }

  public insertBadgeDefinition(badge: BadgeDefinition): BadgeDefinition {
    this.data.badgeDefinitions.push(badge);
    this.save();
    if (isMongoConnected()) {
      BadgeDefinitionModel.findOneAndUpdate({ id: badge.id }, badge, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo badge def insert error:', err)
      );
    }
    return badge;
  }

  public updateBadgeDefinition(id: string, updates: Partial<BadgeDefinition>): BadgeDefinition | undefined {
    const index = this.data.badgeDefinitions.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    this.data.badgeDefinitions[index] = { ...this.data.badgeDefinitions[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      BadgeDefinitionModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo badge def update error:', err)
      );
    }
    return this.data.badgeDefinitions[index];
  }

  public getVouchers(): DiscountVoucher[] {
    return this.data.vouchers;
  }

  public getVoucherByCode(code: string): DiscountVoucher | undefined {
    return this.data.vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
  }

  public insertVoucher(voucher: DiscountVoucher): DiscountVoucher {
    this.data.vouchers.push(voucher);
    this.save();
    if (isMongoConnected()) {
      DiscountVoucherModel.findOneAndUpdate({ id: voucher.id }, voucher, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo voucher insert error:', err)
      );
    }
    return voucher;
  }

  public updateVoucher(id: string, updates: Partial<DiscountVoucher>): DiscountVoucher | undefined {
    const index = this.data.vouchers.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    this.data.vouchers[index] = { ...this.data.vouchers[index], ...updates };
    this.save();
    if (isMongoConnected()) {
      DiscountVoucherModel.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' }).catch(err =>
        console.error('Mongo voucher update error:', err)
      );
    }
    return this.data.vouchers[index];
  }

  public markVoucherUsed(code: string): boolean {
    const v = this.data.vouchers.find(item => item.code.toUpperCase() === code.toUpperCase());
    if (v) {
      v.isUsed = true;
      this.save();
      if (isMongoConnected()) {
        DiscountVoucherModel.findOneAndUpdate({ code: code.toUpperCase() }, { $set: { isUsed: true } }).catch(err =>
          console.error('Mongo voucher update error:', err)
        );
      }
      return true;
    }
    return false;
  }

  // --- Admin Analytics & Settings ---
  public getAnalytics(): AdminAnalytics {
    return this.data.analytics;
  }

  public getAdminSettings(): AdminSettings {
    return this.data.adminSettings;
  }

  public updateAdminSettings(settings: Partial<AdminSettings>): AdminSettings {
    this.data.adminSettings = { ...this.data.adminSettings, ...settings };
    this.save();
    if (isMongoConnected()) {
      AdminSettingsModel.findOneAndUpdate(
        { key: 'global_settings' },
        { $set: settings },
        { upsert: true, returnDocument: 'after' }
      ).catch(err => console.error('Mongo settings update error:', err));
    }
    return this.data.adminSettings;
  }

  // --- Assessment History ---
  public getAssessmentHistory(userId?: string): AssessmentResult[] {
    if (userId) {
      return this.data.assessmentHistory.filter(a => a.userId === userId);
    }
    return this.data.assessmentHistory;
  }

  public insertAssessmentResult(res: AssessmentResult): AssessmentResult {
    this.data.assessmentHistory.unshift(res);
    this.save();
    if (isMongoConnected()) {
      AssessmentResultModel.findOneAndUpdate({ id: res.id }, res, { upsert: true, returnDocument: 'after' }).catch(err =>
        console.error('Mongo assessment insert error:', err)
      );
    }
    return res;
  }

  // --- Watch Progress Tracking ---
  public getWatchedLearnReels(userId: string): string[] {
    return this.data.watchedLearnReelIds[userId] || [];
  }

  public markLearnReelWatched(userId: string, reelId: string): string[] {
    if (!this.data.watchedLearnReelIds[userId]) {
      this.data.watchedLearnReelIds[userId] = [];
    }
    if (!this.data.watchedLearnReelIds[userId].includes(reelId)) {
      this.data.watchedLearnReelIds[userId].push(reelId);
      this.save();
    }
    return this.data.watchedLearnReelIds[userId];
  }

  public unmarkLearnReel(userId: string, reelId: string): string[] {
    if (!this.data.watchedLearnReelIds[userId]) {
      return [];
    }
    this.data.watchedLearnReelIds[userId] = this.data.watchedLearnReelIds[userId].filter(id => id !== reelId);
    this.save();
    return this.data.watchedLearnReelIds[userId];
  }

  public getCompletedCourseReels(userId: string): Record<string, string[]> {
    return this.data.completedCourseReels[userId] || {};
  }

  public markCourseReelCompleted(userId: string, courseId: string, reelId: string): Record<string, string[]> {
    if (!this.data.completedCourseReels[userId]) {
      this.data.completedCourseReels[userId] = {};
    }
    if (!this.data.completedCourseReels[userId][courseId]) {
      this.data.completedCourseReels[userId][courseId] = [];
    }
    if (!this.data.completedCourseReels[userId][courseId].includes(reelId)) {
      this.data.completedCourseReels[userId][courseId].push(reelId);
      this.save();
    }
    return this.data.completedCourseReels[userId];
  }
}

export const db = new Database();

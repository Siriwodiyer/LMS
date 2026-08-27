import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  UserStatus,
  Reel,
  Course,
  Lesson,
  Quiz,
  Assignment,
  ArticleNote,
  Comment,
  NotificationItem,
  EnrolledStudent,
  AdminAnalytics,
  AssessmentResult,
  Badge,
  BadgeDefinition,
  DiscountVoucher,
  ContentApprovalItem,
  ApprovalStatus,
  PlatformTimeFilter
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_REELS,
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_ASSIGNMENTS,
  INITIAL_ARTICLES,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ENROLLED_STUDENTS,
  INITIAL_ANALYTICS,
  INITIAL_BADGES,
  INITIAL_BADGE_DEFINITIONS,
  INITIAL_VOUCHERS
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AdminSettings {
  passingScoreThreshold: number; // default 80%
  reelsPerAssessment: number;     // default 5 reels
  pointsPerCorrectAnswer: number; // default 50 points
  streakBonusMultiplier: number;  // default 1.5x
}

export interface PlatformOverviewStats {
  totalLearners: number;
  activeLearners: number;
  totalMentors: number;
  activeMentors: number;
  totalCourses: number;
  publishedCourses: number;
  totalEducationalReels: number;
  totalLessons: number;
  totalQuizzes: number;
  overallCourseCompletionRate: number;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginUser: (user: User) => void;
  loginAsRole: (role: UserRole) => void;
  logoutUser: () => void;
  registerUser: (data: { name: string; email: string; role: UserRole; avatar?: string }) => void;
  switchUserRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // RBAC & Permissions
  hasRole: (role: UserRole) => boolean;
  canAccessAdminPortal: () => boolean;
  canManageContent: () => boolean;
  canApproveContent: () => boolean;

  // View As Learner Mode
  isViewAsLearner: boolean;
  setViewAsLearner: (val: boolean) => void;
  isViewAsMentor: boolean;
  setViewAsMentor: (val: boolean) => void;
  isAuthenticated: boolean;

  // User Management
  toggleUserStatus: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;

  // Dynamic Platform Stats
  platformStats: PlatformOverviewStats;

  // Reels & Feed
  reels: Reel[];
  currentReelIndex: number;
  setCurrentReelIndex: (index: number) => void;
  reelsWatchedCount: number;
  watchedReelIds: string[];
  markReelWatched: (reelId: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleBookmarkReel: (reelId: string) => void;
  addNewReel: (newReel: Omit<Reel, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'viewsCount' | 'isLiked' | 'isBookmarked'>) => void;
  updateReel: (reelId: string, updates: Partial<Reel>) => void;
  deleteReel: (reelId: string) => void;
  toggleReelPublish: (reelId: string) => void;

  // Courses & Marketplace
  courses: Course[];
  addNewCourse: (courseData: Omit<Course, 'id' | 'rating' | 'reviewsCount' | 'studentsCount' | 'createdAt'>) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  toggleCoursePublish: (courseId: string) => void;
  updateCourseStatus: (courseId: string, status: ApprovalStatus, feedback?: string) => void;
  enrollInCourse: (courseId: string, discountCode?: string) => { success: boolean; message: string };
  enrolledStudents: EnrolledStudent[];

  // Lessons
  lessons: Lesson[];
  createLesson: (lessonData: Omit<Lesson, 'id' | 'createdAt'>) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  reorderLessons: (courseId: string, moduleId: string, sourceIndex: number, destIndex: number) => void;

  // Quizzes
  quizzes: Quiz[];
  createQuiz: (quizData: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (quizId: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (quizId: string) => void;

  // Assignments
  assignments: Assignment[];
  createAssignment: (assignData: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (assignId: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (assignId: string) => void;
  gradeAssignmentSubmission: (assignId: string, subId: string, marks: number, feedback?: string) => void;

  // Articles & Notes
  articles: ArticleNote[];
  createArticle: (articleData: Omit<ArticleNote, 'id' | 'createdAt'>) => void;
  updateArticle: (articleId: string, updates: Partial<ArticleNote>) => void;
  deleteArticle: (articleId: string) => void;

  // Content Approval Workflow
  approvalQueue: ContentApprovalItem[];
  submitContentForApproval: (item: Omit<ContentApprovalItem, 'id' | 'submissionDate' | 'status' | 'feedbackHistory'>) => void;
  approveContent: (approvalId: string, publishImmediately?: boolean) => void;
  rejectContent: (approvalId: string, reason: string) => void;
  requestChangesContent: (approvalId: string, feedback: string) => void;
  publishContentDirectly: (approvalId: string) => void;

  // Comments
  comments: Comment[];
  addComment: (reelId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  flagComment: (commentId: string, reason: string) => void;

  // Assessments
  isAssessmentOpen: boolean;
  openAssessment: () => void;
  closeAssessment: () => void;
  assessmentQueue: Reel[];
  submitAssessmentAnswers: (answers: Record<string, number>) => AssessmentResult;
  assessmentHistory: AssessmentResult[];
  latestAssessmentResult: AssessmentResult | null;
  resetAssessmentResult: () => void;

  // Rewards & Badges
  badges: Badge[];
  badgeDefinitions: BadgeDefinition[];
  createBadgeDefinition: (badge: Omit<BadgeDefinition, 'id' | 'earnedCount' | 'createdAt'>) => void;
  updateBadgeDefinition: (id: string, updates: Partial<BadgeDefinition>) => void;
  toggleBadgeActive: (id: string) => void;
  vouchers: DiscountVoucher[];
  redeemVoucher: (code: string) => number;

  // Admin Analytics & Settings
  analytics: AdminAnalytics;
  timeFilter: PlatformTimeFilter;
  setTimeFilter: (filter: PlatformTimeFilter) => void;
  adminSettings: AdminSettings;
  updateAdminSettings: (newSettings: Partial<AdminSettings>) => void;

  // Notifications & Toasts
  notifications: NotificationItem[];
  markNotificationRead: (notifId: string) => void;
  clearAllNotifications: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('lms_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('lms_current_user_id_v3');
    return saved || 'user-student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lms_is_authenticated_v3') === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isViewAsLearner, setIsViewAsLearner] = useState<boolean>(false);
  const [isViewAsMentor, setIsViewAsMentor] = useState<boolean>(false);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Reels
  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('lms_reels_v3');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [reelsWatchedCount, setReelsWatchedCount] = useState<number>(() => {
    const saved = localStorage.getItem('lms_reels_watched_count_v3');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [watchedReelIds, setWatchedReelIds] = useState<string[]>(['reel-java-1', 'reel-dsa-1']);

  // Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lms_courses_v3');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  // Lessons
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('lms_lessons_v3');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  // Quizzes
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('lms_quizzes_v3');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('lms_assignments_v3');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  // Articles
  const [articles, setArticles] = useState<ArticleNote[]>(() => {
    const saved = localStorage.getItem('lms_articles_v3');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  // Approval Queue
  const [approvalQueue, setApprovalQueue] = useState<ContentApprovalItem[]>(() => {
    const saved = localStorage.getItem('lms_approval_queue_v3');
    return saved ? JSON.parse(saved) : INITIAL_APPROVAL_QUEUE;
  });

  // Enrolled Students
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>(() => {
    const saved = localStorage.getItem('lms_enrolled_students_v3');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLED_STUDENTS;
  });

  // Comments
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('lms_comments_v3');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  // Badges & Definitions
  const [badgeDefinitions, setBadgeDefinitions] = useState<BadgeDefinition[]>(() => {
    const saved = localStorage.getItem('lms_badge_definitions_v3');
    return saved ? JSON.parse(saved) : INITIAL_BADGE_DEFINITIONS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('lms_badges_v3');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [vouchers, setVouchers] = useState<DiscountVoucher[]>(() => {
    const saved = localStorage.getItem('lms_vouchers_v3');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  // Notifications & Toasts
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('lms_notifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Assessment Modal & Result
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [latestAssessmentResult, setLatestAssessmentResult] = useState<AssessmentResult | null>(null);

  // Time filter for Platform Analytics
  const [timeFilter, setTimeFilter] = useState<PlatformTimeFilter>('30d');

  // Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('lms_admin_settings_v3');
    return saved
      ? JSON.parse(saved)
      : {
          passingScoreThreshold: 80,
          reelsPerAssessment: 5,
          pointsPerCorrectAnswer: 50,
          streakBonusMultiplier: 1.5,
        };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('lms_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lms_current_user_id_v3', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('lms_is_authenticated_v3', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('lms_reels_v3', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('lms_courses_v3', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lms_lessons_v3', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('lms_quizzes_v3', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('lms_assignments_v3', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('lms_articles_v3', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('lms_approval_queue_v3', JSON.stringify(approvalQueue));
  }, [approvalQueue]);

  useEffect(() => {
    localStorage.setItem('lms_badge_definitions_v3', JSON.stringify(badgeDefinitions));
  }, [badgeDefinitions]);

  useEffect(() => {
    localStorage.setItem('lms_admin_settings_v3', JSON.stringify(adminSettings));
  }, [adminSettings]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Helpers
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginUser = (user: User) => {
    setCurrentUserId(user.id);
    setIsViewAsLearner(false);
    setIsViewAsMentor(false);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.name}! Logged in as ${user.role}.`, 'success');
    closeAuthModal();
  };

  const loginAsRole = (role: UserRole) => {
    const matching = users.find(u => u.role.toLowerCase().includes(role.toLowerCase().replace('role_', '')));
    if (matching) {
      setCurrentUserId(matching.id);
      setIsViewAsLearner(false);
      setIsViewAsMentor(false);
      setIsAuthenticated(true);
      showToast(`Switched persona to ${matching.name} (${role})`, 'success');
      closeAuthModal();
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setIsViewAsLearner(false);
    setIsViewAsMentor(false);
    showToast('Signed out of account.', 'info');
  };

  const registerUser = (data: { name: string; email: string; role: UserRole; avatar?: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      avatar: data.avatar || '',
      role: data.role,
      status: 'active',
      points: 500,
      xp: 1000,
      streakDays: 1,
      level: 1,
      enrolledCourseIds: ['course-java'],
      completedCourseIds: [],
      badges: [INITIAL_BADGES[0]],
      discountVouchers: [INITIAL_VOUCHERS[0]],
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      weeklyHours: [1.0, 1.5, 0.5, 2.0, 1.0, 0.0, 0.0],
      recentActivity: []
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);
    closeAuthModal();
    showToast(`Account successfully registered for ${data.name}!`, 'success');
  };

  const switchUserRole = (newRole: UserRole) => {
    const matching = users.find(u => u.role.toLowerCase().includes(newRole.toLowerCase().replace('role_', '')));
    if (matching) {
      setCurrentUserId(matching.id);
      setIsViewAsLearner(false);
      showToast(`Switched to ${matching.name} (${newRole})`, 'success');
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...updates } : u));
    showToast('Profile updated successfully.', 'success');
  };

  // RBAC Helpers
  const hasRole = (role: UserRole): boolean => {
    const cleanRole = role.toLowerCase().replace('role_', '');
    const userRole = currentUser.role.toLowerCase().replace('role_', '');
    if (cleanRole === 'admin') return userRole === 'admin';
    if (cleanRole === 'mentor') return userRole === 'mentor' || userRole === 'seller' || userRole === 'admin';
    if (cleanRole === 'learner' || cleanRole === 'student') return true;
    return false;
  };

  const canAccessAdminPortal = (): boolean => {
    return currentUser.role === 'admin' || currentUser.role === 'ROLE_ADMIN';
  };

  const canManageContent = (): boolean => {
    return currentUser.role === 'admin' || currentUser.role === 'mentor' || currentUser.role === 'seller';
  };

  const canApproveContent = (): boolean => {
    return currentUser.role === 'admin' || currentUser.role === 'ROLE_ADMIN';
  };

  // User Management
  const toggleUserStatus = (userId: string) => {
    if (!canAccessAdminPortal()) {
      showToast('Permission denied: Only Admin can activate/deactivate accounts.', 'error');
      return;
    }
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus: UserStatus = u.status === 'active' ? 'inactive' : 'active';
          showToast(`Account for ${u.name} is now ${nextStatus.toUpperCase()}.`, nextStatus === 'active' ? 'success' : 'warning');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    if (!canAccessAdminPortal()) {
      showToast('Permission denied: Admin privileges required.', 'error');
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    showToast('User record updated.', 'success');
  };

  // Dynamic Platform Overview Statistics Calculator
  const platformStats = useMemo<PlatformOverviewStats>(() => {
    const learners = users.filter(u => u.role === 'student' || u.role === 'learner' || u.role === 'ROLE_LEARNER');
    const mentors = users.filter(u => u.role === 'mentor' || u.role === 'seller' || u.role === 'ROLE_MENTOR');

    const totalLearners = learners.length;
    const activeLearners = learners.filter(u => u.status === 'active').length;
    const totalMentors = mentors.length;
    const activeMentors = mentors.filter(u => u.status === 'active').length;

    const totalCoursesCount = courses.length;
    const publishedCoursesCount = courses.filter(c => c.status === 'published' || c.status === 'approved').length;
    const totalEducationalReels = reels.length;
    const totalLessonsCount = lessons.length;
    const totalQuizzesCount = quizzes.length;

    // Calculate dynamic completion rate
    const totalEnrollments = enrolledStudents.length;
    const completedEnrollments = enrolledStudents.filter(e => (e.progressPercent || 0) >= 100).length;
    const overallCourseCompletionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100 * 10) / 10
      : 36.5;

    return {
      totalLearners,
      activeLearners,
      totalMentors,
      activeMentors,
      totalCourses: totalCoursesCount,
      publishedCourses: publishedCoursesCount,
      totalEducationalReels,
      totalLessons: totalLessonsCount,
      totalQuizzes: totalQuizzesCount,
      overallCourseCompletionRate: overallCourseCompletionRate > 0 ? overallCourseCompletionRate : 36.8,
    };
  }, [users, courses, reels, lessons, quizzes, enrolledStudents]);

  // Reels
  const markReelWatched = (reelId: string) => {
    if (!watchedReelIds.includes(reelId)) {
      const nextWatched = [...watchedReelIds, reelId];
      setWatchedReelIds(nextWatched);
      const nextCount = reelsWatchedCount + 1;
      setReelsWatchedCount(nextCount);
      localStorage.setItem('lms_reels_watched_count_v3', nextCount.toString());

      setReels(prev =>
        prev.map(r => (r.id === reelId ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r))
      );

      setUsers(prev =>
        prev.map(u => (u.id === currentUserId ? { ...u, reelsWatchedTotal: (u.reelsWatchedTotal || 0) + 1 } : u))
      );

      if (nextCount >= adminSettings.reelsPerAssessment) {
        showToast(`🎯 You've watched ${adminSettings.reelsPerAssessment} reels! Automated micro-assessment is ready.`, 'info');
      }
    }
  };

  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  const toggleBookmarkReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isBookmarked = !r.isBookmarked;
          showToast(isBookmarked ? 'Reel saved to bookmarks' : 'Reel removed from bookmarks', 'info');
          return { ...r, isBookmarked };
        }
        return r;
      })
    );
  };

  const addNewReel = (newReelData: Omit<Reel, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'viewsCount' | 'isLiked' | 'isBookmarked'>) => {
    const isDirectAdmin = currentUser.role === 'admin' || currentUser.role === 'ROLE_ADMIN';
    const newReel: Reel = {
      ...newReelData,
      id: `reel-${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isLiked: false,
      isBookmarked: false,
      isPublished: isDirectAdmin ? (newReelData.isPublished ?? true) : false,
      createdAt: new Date().toISOString()
    };

    setReels(prev => [newReel, ...prev]);

    if (!isDirectAdmin) {
      // Submit to approval queue
      submitContentForApproval({
        contentType: 'reel',
        contentId: newReel.id,
        title: newReel.title,
        categoryOrSubject: newReel.subject || newReel.category,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorRole: currentUser.role === 'admin' ? 'Admin' : 'Mentor'
      });
      showToast('Educational reel submitted for Admin quality vetting.', 'info');
    } else {
      showToast('Educational reel created and published successfully!', 'success');
    }
  };

  const updateReel = (reelId: string, updates: Partial<Reel>) => {
    setReels(prev => prev.map(r => r.id === reelId ? { ...r, ...updates } : r));
    showToast('Reel details updated.', 'success');
  };

  const deleteReel = (reelId: string) => {
    setReels(prev => prev.filter(r => r.id !== reelId));
    setApprovalQueue(prev => prev.filter(a => a.contentId !== reelId));
    showToast('Reel deleted from platform.', 'info');
  };

  const toggleReelPublish = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const nextPub = !r.isPublished;
          showToast(`Reel "${r.title}" is now ${nextPub ? 'PUBLISHED in Learner Feed' : 'UNPUBLISHED'}.`, 'info');
          return { ...r, isPublished: nextPub };
        }
        return r;
      })
    );
  };

  // Courses
  const addNewCourse = (courseData: Omit<Course, 'id' | 'rating' | 'reviewsCount' | 'studentsCount' | 'createdAt'>) => {
    const isDirectAdmin = currentUser.role === 'admin' || currentUser.role === 'ROLE_ADMIN';
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      status: isDirectAdmin ? 'published' : 'submitted',
      createdAt: new Date().toISOString()
    };

    setCourses(prev => [newCourse, ...prev]);

    if (!isDirectAdmin) {
      submitContentForApproval({
        contentType: 'course',
        contentId: newCourse.id,
        title: newCourse.title,
        categoryOrSubject: newCourse.category,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorRole: currentUser.role === 'admin' ? 'Admin' : 'Mentor'
      });
      showToast('Course curriculum submitted to Admin approval queue.', 'info');
    } else {
      showToast('Course published directly to student catalog!', 'success');
    }
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
    showToast('Course updated successfully.', 'success');
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setApprovalQueue(prev => prev.filter(a => a.contentId !== courseId));
    showToast('Course deleted from platform.', 'info');
  };

  const toggleCoursePublish = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const isCurrentlyPublished = c.status === 'published' || c.status === 'approved';
          const nextStatus: ApprovalStatus = isCurrentlyPublished ? 'draft' : 'published';
          showToast(`Course "${c.title}" is now ${nextStatus.toUpperCase()}.`, 'info');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const updateCourseStatus = (courseId: string, status: ApprovalStatus, feedback?: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          return { ...c, status, rejectionFeedback: feedback };
        }
        return c;
      })
    );
    showToast(`Course status updated to ${status}.`, 'info');
  };

  const enrollInCourse = (courseId: string, discountCode?: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return { success: false, message: 'Course not found' };

    if (currentUser.enrolledCourseIds.includes(courseId)) {
      return { success: false, message: 'You are already enrolled in this course.' };
    }

    const newEnrollment: EnrolledStudent = {
      id: `enr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      courseId: course.id,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      lastActive: new Date().toISOString(),
      quizAverage: 0
    };

    setEnrolledStudents(prev => [newEnrollment, ...prev]);

    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, studentsCount: (c.studentsCount || 0) + 1 } : c))
    );

    setUsers(prev =>
      prev.map(u =>
        u.id === currentUserId
          ? {
              ...u,
              enrolledCourseIds: [...u.enrolledCourseIds, courseId],
              points: u.points + 100,
              xp: u.xp + 250
            }
          : u
      )
    );

    showToast(`Successfully enrolled in "${course.title}"! +100 Points & 250 XP earned.`, 'success');
    return { success: true, message: 'Enrolled successfully' };
  };

  // Lessons
  const createLesson = (lessonData: Omit<Lesson, 'id' | 'createdAt'>) => {
    const newLesson: Lesson = {
      ...lessonData,
      id: `les-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 0
    };
    setLessons(prev => [...prev, newLesson]);
    showToast(`Lesson "${newLesson.title}" created successfully.`, 'success');
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, ...updates } : l));
    showToast('Lesson updated.', 'success');
  };

  const deleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(l => l.id !== lessonId));
    showToast('Lesson deleted.', 'info');
  };

  const reorderLessons = (courseId: string, moduleId: string, sourceIndex: number, destIndex: number) => {
    setLessons(prev => {
      const moduleLessons = prev.filter(l => l.courseId === courseId && l.moduleId === moduleId).sort((a, b) => a.order - b.order);
      const otherLessons = prev.filter(l => !(l.courseId === courseId && l.moduleId === moduleId));
      
      const [moved] = moduleLessons.splice(sourceIndex, 1);
      moduleLessons.splice(destIndex, 0, moved);

      const reordered = moduleLessons.map((item, idx) => ({ ...item, order: idx + 1 }));
      return [...otherLessons, ...reordered];
    });
    showToast('Lesson order updated.', 'info');
  };

  // Quizzes
  const createQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setQuizzes(prev => [...prev, newQuiz]);
    showToast(`Quiz "${newQuiz.title}" created.`, 'success');
  };

  const updateQuiz = (quizId: string, updates: Partial<Quiz>) => {
    setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, ...updates } : q));
    showToast('Quiz updated.', 'success');
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    showToast('Quiz deleted.', 'info');
  };

  // Assignments
  const createAssignment = (assignData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssign: Assignment = {
      ...assignData,
      id: `assign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    setAssignments(prev => [...prev, newAssign]);
    showToast(`Assignment "${newAssign.title}" created.`, 'success');
  };

  const updateAssignment = (assignId: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === assignId ? { ...a, ...updates } : a));
    showToast('Assignment updated.', 'success');
  };

  const deleteAssignment = (assignId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignId));
    showToast('Assignment deleted.', 'info');
  };

  const gradeAssignmentSubmission = (assignId: string, subId: string, marks: number, feedback?: string) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignId && a.submissions) {
          const nextSubs = a.submissions.map(s => {
            if (s.id === subId) {
              return { ...s, status: 'graded' as const, marksAwarded: marks, feedback };
            }
            return s;
          });
          return { ...a, submissions: nextSubs };
        }
        return a;
      })
    );
    showToast(`Assignment submission graded (${marks}/${100}).`, 'success');
  };

  // Articles
  const createArticle = (articleData: Omit<ArticleNote, 'id' | 'createdAt'>) => {
    const newArt: ArticleNote = {
      ...articleData,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setArticles(prev => [newArt, ...prev]);
    showToast(`Article "${newArt.title}" published!`, 'success');
  };

  const updateArticle = (articleId: string, updates: Partial<ArticleNote>) => {
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, ...updates } : a));
    showToast('Article updated.', 'success');
  };

  const deleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
    showToast('Article deleted.', 'info');
  };

  // Content Approval Pipeline
  const submitContentForApproval = (item: Omit<ContentApprovalItem, 'id' | 'submissionDate' | 'status' | 'feedbackHistory'>) => {
    const newItem: ContentApprovalItem = {
      ...item,
      id: `appr-${Date.now()}`,
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: 'System Gateway',
          action: 'submitted',
          feedback: `Content submitted by ${item.creatorName} for review.`
        }
      ]
    };
    setApprovalQueue(prev => [newItem, ...prev]);
  };

  const approveContent = (approvalId: string, publishImmediately: boolean = true) => {
    if (!canApproveContent()) {
      showToast('Permission denied: Only Admin can approve content.', 'error');
      return;
    }
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.id === approvalId) {
          const nextStatus: ApprovalStatus = publishImmediately ? 'published' : 'approved';
          const nextHistory = [
            ...(item.feedbackHistory || []),
            {
              date: new Date().toISOString(),
              adminName: currentUser.name,
              action: publishImmediately ? ('published' as const) : ('approved' as const),
              feedback: 'Curriculum verified and approved.'
            }
          ];

          // Also update corresponding entity
          if (item.contentType === 'course') {
            setCourses(cList => cList.map(c => c.id === item.contentId ? { ...c, status: nextStatus } : c));
          } else if (item.contentType === 'reel') {
            setReels(rList => rList.map(r => r.id === item.contentId ? { ...r, isPublished: true } : r));
          }

          showToast(`Content "${item.title}" approved and ${publishImmediately ? 'PUBLISHED' : 'ready'}.`, 'success');
          return {
            ...item,
            status: nextStatus,
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: nextHistory
          };
        }
        return item;
      })
    );
  };

  const rejectContent = (approvalId: string, reason: string) => {
    if (!canApproveContent()) {
      showToast('Permission denied: Only Admin can reject content.', 'error');
      return;
    }
    if (!reason.trim()) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.id === approvalId) {
          const nextHistory = [
            ...(item.feedbackHistory || []),
            {
              date: new Date().toISOString(),
              adminName: currentUser.name,
              action: 'rejected' as const,
              feedback: reason.trim()
            }
          ];

          if (item.contentType === 'course') {
            setCourses(cList => cList.map(c => c.id === item.contentId ? { ...c, status: 'rejected', rejectionFeedback: reason.trim() } : c));
          } else if (item.contentType === 'reel') {
            setReels(rList => rList.map(r => r.id === item.contentId ? { ...r, isPublished: false } : r));
          }

          showToast(`Content rejected. Feedback sent to mentor.`, 'warning');
          return {
            ...item,
            status: 'rejected',
            rejectionReason: reason.trim(),
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: nextHistory
          };
        }
        return item;
      })
    );
  };

  const requestChangesContent = (approvalId: string, feedback: string) => {
    if (!canApproveContent()) {
      showToast('Permission denied.', 'error');
      return;
    }
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.id === approvalId) {
          const nextHistory = [
            ...(item.feedbackHistory || []),
            {
              date: new Date().toISOString(),
              adminName: currentUser.name,
              action: 'requested_changes' as const,
              feedback: feedback.trim()
            }
          ];
          showToast(`Requested changes from creator.`, 'info');
          return {
            ...item,
            status: 'under_review',
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: nextHistory
          };
        }
        return item;
      })
    );
  };

  const publishContentDirectly = (approvalId: string) => {
    approveContent(approvalId, true);
  };

  // Badges Management
  const createBadgeDefinition = (badgeData: Omit<BadgeDefinition, 'id' | 'earnedCount' | 'createdAt'>) => {
    const newBadge: BadgeDefinition = {
      ...badgeData,
      id: `badge-def-${Date.now()}`,
      earnedCount: 0,
      createdAt: new Date().toISOString()
    };
    setBadgeDefinitions(prev => [...prev, newBadge]);
    showToast(`Badge "${newBadge.title}" defined and active!`, 'success');
  };

  const updateBadgeDefinition = (id: string, updates: Partial<BadgeDefinition>) => {
    setBadgeDefinitions(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast('Badge rule updated.', 'success');
  };

  const toggleBadgeActive = (id: string) => {
    setBadgeDefinitions(prev =>
      prev.map(b => {
        if (b.id === id) {
          const nextActive = !b.isActive;
          showToast(`Badge "${b.title}" is now ${nextActive ? 'ACTIVE' : 'INACTIVE'}.`, 'info');
          return { ...b, isActive: nextActive };
        }
        return b;
      })
    );
  };

  // Comments
  const addComment = (reelId: string, content: string) => {
    if (!content.trim()) return;
    const newComm: Comment = {
      id: `comm-${Date.now()}`,
      reelId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setComments(prev => [newComm, ...prev]);
    setReels(prev =>
      prev.map(r => (r.id === reelId ? { ...r, commentsCount: (r.commentsCount || 0) + 1 } : r))
    );
    showToast('Comment posted.', 'success');
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    showToast('Comment deleted.', 'info');
  };

  const flagComment = (commentId: string, reason: string) => {
    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, isFlagged: true, flagReason: reason } : c))
    );
    showToast('Comment flagged for admin moderation.', 'warning');
  };

  // Assessments
  const openAssessment = () => {
    setIsAssessmentOpen(true);
  };

  const closeAssessment = () => {
    setIsAssessmentOpen(false);
  };

  const assessmentQueue = useMemo(() => {
    const queue = reels.filter(r => r.questions && r.questions.length > 0 && r.isPublished);
    return queue.slice(0, adminSettings.reelsPerAssessment);
  }, [reels, adminSettings.reelsPerAssessment]);

  const submitAssessmentAnswers = (answers: Record<string, number>): AssessmentResult => {
    const questions = assessmentQueue.flatMap(r => r.questions);
    let correctCount = 0;

    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length || 1;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= adminSettings.passingScoreThreshold;

    const pointsEarned = correctCount * adminSettings.pointsPerCorrectAnswer;
    const rewardsEarned: AssessmentResult['rewardsEarned'] = {
      points: pointsEarned,
    };

    if (passed) {
      if (scorePercentage === 100) {
        rewardsEarned.badge = INITIAL_BADGES[0]; // Speed Learner
      }
      rewardsEarned.voucher = INITIAL_VOUCHERS[0]; // 30% discount
    }

    const result: AssessmentResult = {
      id: `result-${Date.now()}`,
      userId: currentUser.id,
      reelIds: assessmentQueue.map(r => r.id),
      totalQuestions,
      correctCount,
      scorePercentage,
      passed,
      completedAt: new Date().toISOString(),
      rewardsEarned
    };

    setAssessmentHistory(prev => [result, ...prev]);
    setLatestAssessmentResult(result);

    // Update user stats
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
          const nextPoints = u.points + pointsEarned;
          const nextXP = u.xp + (passed ? 200 : 50);
          const nextLevel = Math.floor(nextXP / 1000) + 1;
          const nextStreak = passed ? u.streakDays + 1 : u.streakDays;

          const updatedBadges = [...u.badges];
          if (rewardsEarned.badge && !updatedBadges.some(b => b.id === rewardsEarned.badge?.id)) {
            updatedBadges.push(rewardsEarned.badge);
          }

          const updatedVouchers = [...u.discountVouchers];
          if (rewardsEarned.voucher && !updatedVouchers.some(v => v.id === rewardsEarned.voucher?.id)) {
            updatedVouchers.push(rewardsEarned.voucher);
          }

          return {
            ...u,
            points: nextPoints,
            xp: nextXP,
            level: nextLevel,
            streakDays: nextStreak,
            badges: updatedBadges,
            discountVouchers: updatedVouchers
          };
        }
        return u;
      })
    );

    // Reset watched count
    setReelsWatchedCount(0);
    localStorage.setItem('lms_reels_watched_count_v3', '0');

    return result;
  };

  const resetAssessmentResult = () => {
    setLatestAssessmentResult(null);
  };

  const redeemVoucher = (code: string): number => {
    const v = vouchers.find(item => item.code.toUpperCase() === code.toUpperCase() && !item.isUsed);
    if (v) {
      setVouchers(prev => prev.map(item => (item.id === v.id ? { ...item, isUsed: true } : item)));
      showToast(`Voucher "${code}" applied! ${v.discountPercent}% OFF discount active.`, 'success');
      return v.discountPercent;
    }
    showToast('Invalid or already redeemed voucher code.', 'error');
    return 0;
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Admin platform governance settings updated.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        loginAsRole,
        logoutUser,
        registerUser,
        switchUserRole,
        updateUserProfile,
        hasRole,
        canAccessAdminPortal,
        canManageContent,
        canApproveContent,
        isViewAsLearner,
        setViewAsLearner: setIsViewAsLearner,
        isViewAsMentor,
        setViewAsMentor: setIsViewAsMentor,
        isAuthenticated,
        toggleUserStatus,
        updateUser,
        platformStats,
        reels,
        currentReelIndex,
        setCurrentReelIndex,
        reelsWatchedCount,
        watchedReelIds,
        markReelWatched,
        toggleLikeReel,
        toggleBookmarkReel,
        addNewReel,
        updateReel,
        deleteReel,
        toggleReelPublish,
        courses,
        addNewCourse,
        updateCourse,
        deleteCourse,
        toggleCoursePublish,
        updateCourseStatus,
        enrollInCourse,
        enrolledStudents,
        lessons,
        createLesson,
        updateLesson,
        deleteLesson,
        reorderLessons,
        quizzes,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        assignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        gradeAssignmentSubmission,
        articles,
        createArticle,
        updateArticle,
        deleteArticle,
        approvalQueue,
        submitContentForApproval,
        approveContent,
        rejectContent,
        requestChangesContent,
        publishContentDirectly,
        comments,
        addComment,
        deleteComment,
        flagComment,
        isAssessmentOpen,
        openAssessment,
        closeAssessment,
        assessmentQueue,
        submitAssessmentAnswers,
        assessmentHistory,
        latestAssessmentResult,
        resetAssessmentResult,
        badges,
        badgeDefinitions,
        createBadgeDefinition,
        updateBadgeDefinition,
        toggleBadgeActive,
        vouchers,
        redeemVoucher,
        analytics: INITIAL_ANALYTICS,
        timeFilter,
        setTimeFilter,
        adminSettings,
        updateAdminSettings,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

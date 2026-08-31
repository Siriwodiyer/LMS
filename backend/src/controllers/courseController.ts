import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Course, EnrolledStudent, ApprovalStatus } from '../types/index.js';

export const getCourses = (req: Request, res: Response): void => {
  try {
    const { category, level, instructorId, status, search } = req.query;
    let courses = db.getCourses();

    if (category && typeof category === 'string' && category !== 'All') {
      courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (level && typeof level === 'string' && level !== 'All Levels') {
      courses = courses.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }

    if (instructorId && typeof instructorId === 'string') {
      courses = courses.filter(c => c.instructorId === instructorId);
    }

    if (status && typeof status === 'string') {
      courses = courses.filter(c => c.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: courses.length, courses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourseById = (req: Request, res: Response): void => {
  try {
    const course = db.getCourseById(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    // Attach related quizzes and assignments
    const quizzes = db.getQuizzes(course.id);
    const assignments = db.getAssignments(course.id);
    const feedback = db.getCourseFeedback(course.id);

    res.json({
      success: true,
      course: {
        ...course,
        quizzes,
        assignments,
        feedback
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCourse = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const instructorId = req.user?.id || data.instructorId || 'user-mentor';
    const instructorUser = db.getUserById(instructorId);

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: data.title || 'Untitled Course',
      subtitle: data.subtitle || '',
      description: data.description || '',
      category: data.category || 'General',
      price: Number(data.price) || 0,
      discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : undefined,
      instructorId,
      instructorName: instructorUser?.name || data.instructorName || 'Instructor',
      instructorAvatar: instructorUser?.avatar,
      instructorBio: instructorUser?.bio || 'Verified LMS Educator',
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      level: data.level || 'Beginner',
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      modules: data.modules || [],
      reels: data.reels || [],
      learningOutcomes: data.learningOutcomes || [],
      status: (data.status as ApprovalStatus) || 'submitted',
      durationHours: data.durationHours || 5,
      lessonsCount: data.reels?.length || data.modules?.length || 5,
      reelsCount: data.reels?.length || 5,
      quizzesCount: data.quizzesCount || 1,
      assignmentsCount: data.assignmentsCount || 1,
      createdAt: new Date().toISOString()
    };

    const saved = db.insertCourse(newCourse);

    // If submitted for approval, also add an approval item into approval queue
    if (newCourse.status === 'submitted') {
      db.insertApprovalItem({
        id: `appr-${Date.now()}`,
        contentType: 'course',
        contentId: saved.id,
        title: `${saved.title} (5 Reels)`,
        categoryOrSubject: saved.category,
        creatorId: instructorId,
        creatorName: newCourse.instructorName,
        creatorRole: instructorUser?.role === 'admin' ? 'Admin' : 'Mentor',
        status: 'submitted',
        submissionDate: new Date().toISOString(),
        feedbackHistory: [
          {
            date: new Date().toISOString(),
            adminName: 'System Gateway',
            action: 'submitted',
            feedback: 'Course submitted with vertical learning reels for curriculum review.'
          }
        ]
      });
    }

    res.status(201).json({ success: true, message: 'Course created successfully.', course: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCourse = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateCourse(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }
    res.json({ success: true, message: 'Course updated successfully.', course: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCourse = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteCourse(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePublish = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const course = db.getCourseById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    const newStatus: ApprovalStatus = course.status === 'published' ? 'draft' : 'published';
    const updated = db.updateCourse(id, { status: newStatus });

    res.json({ success: true, status: newStatus, message: `Course ${newStatus === 'published' ? 'published' : 'unpublished'}.`, course: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCourseStatus = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const course = db.getCourseById(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    const updated = db.updateCourse(id, {
      status,
      rejectionFeedback: feedback
    });

    // Notify instructor
    if (course.instructorId) {
      db.insertNotification({
        id: `notif-${Date.now()}`,
        userId: course.instructorId,
        title: `Course ${status === 'approved' || status === 'published' ? 'Approved' : 'Status Updated'}: "${course.title}"`,
        message: feedback || `Your course status is now ${status}.`,
        type: 'course',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.json({ success: true, message: `Course status updated to ${status}.`, course: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const enroll = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id: courseId } = req.params;
    const { discountCode } = req.body;
    const userId = req.user?.id || req.body.userId || 'user-student';

    const course = db.getCourseById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    const user = db.getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.enrolledCourseIds.includes(courseId)) {
      res.status(400).json({ success: false, message: 'You are already enrolled in this course.' });
      return;
    }

    // Calculate pricing and validate voucher
    let finalPrice = course.discountedPrice !== undefined ? course.discountedPrice : course.price;
    if (discountCode) {
      const voucher = db.getVouchers().find(v => v.code.toUpperCase() === discountCode.trim().toUpperCase() && !v.isUsed);
      if (voucher) {
        finalPrice = Math.round(finalPrice * (1 - voucher.discountPercent / 100));
        db.updateVoucher(voucher.id, { isUsed: true });
      }
    }

    // Update user enrolled courses
    const updatedEnrolled = [...user.enrolledCourseIds, courseId];
    db.updateUser(userId, { enrolledCourseIds: updatedEnrolled });

    // Increment course student count
    const studentsCount = (course.studentsCount || 0) + 1;
    db.updateCourse(courseId, { studentsCount });

    // Create EnrolledStudent record
    const enrRecord: EnrolledStudent = {
      id: `enr-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      courseId: course.id,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      lastActive: new Date().toISOString()
    };
    db.insertEnrolledStudent(enrRecord);

    // Create Notification
    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: `🎉 Enrolled in ${course.title}`,
      message: `You now have full access to all 5 micro-reels, quizzes, and capstone assignments.`,
      type: 'course',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Successfully enrolled in ${course.title}!`,
      finalPrice,
      course
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEnrolledStudents = (req: Request, res: Response): void => {
  try {
    const { courseId, userId } = req.query;
    const list = db.getEnrolledStudents(courseId as string, userId as string);
    res.json({ success: true, count: list.length, enrolledStudents: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markCourseReelCompleted = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { courseId, reelId } = req.params;
    const userId = req.user?.id || req.body.userId || 'user-student';

    const completed = db.markCourseReelCompleted(userId, courseId, reelId);
    const course = db.getCourseById(courseId);

    // Calculate progress
    const totalReels = course?.reels?.length || 5;
    const completedCount = completed[courseId]?.length || 0;
    const progressPercent = Math.min(100, Math.round((completedCount / totalReels) * 100));

    // Update EnrolledStudent progress
    const enr = db.getEnrolledStudents(courseId, userId)[0];
    if (enr) {
      db.updateEnrolledStudent(enr.id, {
        progressPercent,
        lastActive: new Date().toISOString(),
        ...(progressPercent === 100 && { completedAt: new Date().toISOString() })
      });
    }

    res.json({
      success: true,
      completedCourseReels: completed,
      progressPercent
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourseProgress = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id || (req.query.userId as string) || 'user-student';
    const completed = db.getCompletedCourseReels(userId);
    res.json({ success: true, completedCourseReels: completed });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

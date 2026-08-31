import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { MentorApplication } from '../types/index.js';
import { UserModel } from '../models/index.js';
import { isMongoConnected } from '../config/mongo.js';

export const getApplications = (req: Request, res: Response): void => {
  try {
    const { status } = req.query;
    let apps = db.getMentorApplications();
    if (status && typeof status === 'string') {
      apps = apps.filter(a => a.status === status);
    }
    res.json({ success: true, count: apps.length, applications: apps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApplicationById = (req: Request, res: Response): void => {
  try {
    const app = db.getMentorApplicationById(req.params.id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }
    res.json({ success: true, application: app });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitApplication = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const userId = req.user?.id || data.userId || 'user-student';
    const user = db.getUserById(userId);

    const newApp: MentorApplication = {
      id: `app-${Date.now()}`,
      userId,
      applicantName: user?.name || data.applicantName || 'Applicant',
      applicantEmail: user?.email || data.applicantEmail || 'applicant@lms.ai',
      applicantAvatar: user?.avatar || data.applicantAvatar,
      expertise: data.expertise || 'Software Engineering',
      skills: data.skills || ['JavaScript', 'TypeScript', 'React'],
      experienceYears: Number(data.experienceYears) || 2,
      bio: data.bio || '',
      portfolioUrl: data.portfolioUrl,
      assessmentsCompleted: data.assessmentsCompleted || 3,
      averageScore: data.averageScore || 85,
      status: 'submitted',
      submissionDate: new Date().toISOString()
    };

    const saved = db.insertMentorApplication(newApp);

    // Update user mentor application id
    if (user) {
      db.updateUser(userId, { mentorApplicationId: saved.id });
    }

    res.status(201).json({
      success: true,
      message: 'Mentor application submitted successfully. Administrator will review within 24-48 hours.',
      application: saved
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveApplication = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const app = db.getMentorApplicationById(id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const updated = db.updateMentorApplication(id, {
      status: 'approved',
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName
    });

    // Elevate user role to Mentor and activate account
    db.updateUser(app.userId, {
      role: 'mentor',
      status: 'active',
      specialty: app.expertise,
      bio: app.bio
    });

    if (isMongoConnected()) {
      UserModel.findOneAndUpdate(
        { id: app.userId },
        { role: 'mentor', status: 'active', specialty: app.expertise, bio: app.bio }
      ).catch(err => console.error('MongoDB mentor status update error:', err));
    }

    // Notify user
    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: app.userId,
      title: '🎉 Mentor Application Approved!',
      message: `Congratulations ${app.applicantName}! You are now a Verified LMS Mentor. You can now access the Mentor Portal and publish courses.`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Mentor application approved. ${app.applicantName} elevated to Mentor role.`,
      application: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectApplication = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const app = db.getMentorApplicationById(id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const updated = db.updateMentorApplication(id, {
      status: 'rejected',
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName,
      adminFeedback: feedback
    });

    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: app.userId,
      title: 'Mentor Application Update',
      message: `Your mentor application was not approved. Feedback: "${feedback || 'Application criteria not met.'}"`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Mentor application rejected.', application: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestChanges = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const app = db.getMentorApplicationById(id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const updated = db.updateMentorApplication(id, {
      status: 'changes_requested',
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName,
      adminFeedback: feedback
    });

    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: app.userId,
      title: 'Changes Requested on Mentor Application',
      message: `Administrator requested updates: "${feedback || 'Please refine your application.'}"`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Changes requested on application.', application: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resubmitApplication = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const app = db.getMentorApplicationById(id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const updated = db.updateMentorApplication(id, {
      ...updates,
      status: 'submitted',
      submissionDate: new Date().toISOString()
    });

    res.json({ success: true, message: 'Application resubmitted successfully for review.', application: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const checkEligibility = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = (req.query.userId as string) || req.user?.id || 'user-student';
    const user = db.getUserById(userId);
    const settings = db.getAdminSettings();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const minAssessments = settings.mentorEligibilityMinAssessments || 3;
    const minAvgScore = settings.mentorEligibilityAvgScore || 85;

    const history = db.getAssessmentHistory(userId);
    const completedCount = history.length;
    const totalScore = history.reduce((acc, curr) => acc + curr.scorePercentage, 0);
    const avgScore = completedCount > 0 ? Math.round(totalScore / completedCount) : (user.quizAverage || 0);

    const isEligible = completedCount >= minAssessments && avgScore >= minAvgScore;

    let reason = 'Requirements satisfied for Verified Mentor Program application!';
    if (completedCount < minAssessments) {
      reason = `Complete at least ${minAssessments} qualifying assessments (currently ${completedCount}/${minAssessments}).`;
    } else if (avgScore < minAvgScore) {
      reason = `Maintain an average score of at least ${minAvgScore}% (current average: ${avgScore}%).`;
    }

    res.json({
      success: true,
      isEligible,
      completedCount,
      minAssessments,
      avgScore,
      minAvgScore,
      reason
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

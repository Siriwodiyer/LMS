import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { User, UserRole, MentorApplication } from '../types/index.js';
import { UserModel, MentorApplicationModel, ApprovalModel } from '../models/index.js';
import { isMongoConnected } from '../config/mongo.js';

// Helper to remove sensitive password hash from output
const sanitizeUser = (user: User): Omit<User, 'password'> => {
  const { password, ...safeUser } = user;
  return safeUser;
};

/**
 * POST /api/auth/register
 * Learner account creation (Instant active learner)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check existing in DB or MongoDB
    const existing = db.getUserByEmail(trimmedEmail);
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
      return;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      role: 'student',
      status: 'active',
      points: 0,
      xp: 0,
      streakDays: 0,
      level: 1,
      enrolledCourseIds: [],
      completedCourseIds: [],
      badges: [],
      discountVouchers: [],
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      weeklyHours: [0, 0, 0, 0, 0, 0, 0],
      totalLearningHours: 0,
      quizAverage: 0,
      completedLessonsCount: 0,
      reelsWatchedTotal: 0,
      assignmentsCompletedCount: 0,
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          type: 'login',
          title: 'Account Created',
          description: 'Welcome to LMS! Started learning journey.',
          timestamp: 'Just now'
        }
      ]
    };

    const saved = db.insertUser(newUser);

    // Save directly to MongoDB if connected
    if (isMongoConnected()) {
      await UserModel.findOneAndUpdate(
        { email: trimmedEmail },
        newUser,
        { upsert: true, new: true }
      ).catch(err => console.error('MongoDB user insert error:', err));
    }

    const token = generateToken({ userId: saved.id, role: saved.role, email: saved.email });

    res.status(201).json({
      success: true,
      message: 'Learner account created successfully.',
      token,
      user: sanitizeUser(saved)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
};

/**
 * POST /api/auth/mentor-apply
 * Mentor registration with application (Requires Admin approval)
 */
export const mentorApply = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, expertise, experienceYears, bio, portfolioUrl, skills } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existing = db.getUserByEmail(trimmedEmail);
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
      return;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = `mentor-${Date.now()}`;
    const appId = `app-${Date.now()}`;

    const newMentorUser: User = {
      id: userId,
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      role: 'mentor',
      status: 'pending', // Requires Admin approval
      points: 0,
      xp: 0,
      streakDays: 0,
      level: 1,
      bio: bio ? bio.trim() : 'Mentor applicant.',
      specialty: expertise ? expertise.trim() : 'Software Engineering',
      mentorApplicationId: appId,
      enrolledCourseIds: [],
      completedCourseIds: [],
      badges: [],
      discountVouchers: [],
      weeklyHours: [0, 0, 0, 0, 0, 0, 0],
      totalLearningHours: 0,
      quizAverage: 0,
      completedLessonsCount: 0,
      reelsWatchedTotal: 0,
      assignmentsCompletedCount: 0,
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      recentActivity: []
    };

    db.insertUser(newMentorUser);

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : ['Software Engineering'];

    const newApplication: MentorApplication = {
      id: appId,
      userId: userId,
      applicantName: name.trim(),
      applicantEmail: trimmedEmail,
      expertise: expertise ? expertise.trim() : 'Full Stack Engineering',
      skills: skillsArray,
      experienceYears: Number(experienceYears) || 3,
      bio: bio ? bio.trim() : 'Passionate educator.',
      portfolioUrl: portfolioUrl ? portfolioUrl.trim() : '',
      assessmentsCompleted: 0,
      averageScore: 90,
      submissionDate: new Date().toISOString(),
      status: 'submitted',
      feedbackHistory: []
    };

    db.insertMentorApplication(newApplication);

    // Also add to approval queue for admin governance
    db.insertApprovalItem({
      id: `appr-${Date.now()}`,
      contentId: appId,
      contentType: 'mentor_application',
      title: `Mentor Application: ${name.trim()} (${expertise || 'Engineering'})`,
      creatorId: userId,
      creatorName: name.trim(),
      creatorRole: 'mentor',
      submissionDate: new Date().toISOString(),
      status: 'submitted'
    });

    if (isMongoConnected()) {
      await Promise.all([
        UserModel.findOneAndUpdate({ email: trimmedEmail }, newMentorUser, { upsert: true, new: true }),
        MentorApplicationModel.findOneAndUpdate({ id: appId }, newApplication, { upsert: true, new: true })
      ]).catch(err => console.error('MongoDB mentor apply error:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Mentor application submitted successfully! Your account will be activated upon Administrator review.',
      applicationId: appId,
      status: 'pending'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Mentor application failed.' });
  }
};

/**
 * POST /api/auth/login
 * Role-less login with secure bcrypt verification & JWT issuance
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check in database or MongoDB
    let user = db.getUserByEmail(trimmedEmail);

    if (!user && isMongoConnected()) {
      const mongoUser = await UserModel.findOne({ email: trimmedEmail });
      if (mongoUser) {
        user = mongoUser.toObject() as User;
        db.insertUser(user);
      }
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password. Please check your credentials.' });
      return;
    }

    // Password verification with bcrypt
    let isPasswordValid = false;

    if (user.password) {
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        // Legacy plain-text fallback: compare directly and upgrade to bcrypt hash
        isPasswordValid = user.password === password;
        if (isPasswordValid) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          db.updateUser(user.id, { password: user.password });
          if (isMongoConnected()) {
            await UserModel.findOneAndUpdate({ email: trimmedEmail }, { password: user.password });
          }
        }
      }
    }

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid email or password. Please check your credentials.' });
      return;
    }

    // Check account status
    const normRole = user.role.toLowerCase().replace('role_', '');

    if (normRole === 'mentor' && (user.status === 'pending' || user.status === 'pending_approval')) {
      res.status(403).json({
        success: false,
        message: 'Your mentor application is currently under review by the Administrator team. You will be able to access the Mentor Portal once approved.'
      });
      return;
    }

    if (user.status === 'inactive' || user.status === 'rejected' || user.status === 'suspended') {
      res.status(403).json({
        success: false,
        message: 'Your account is currently inactive or suspended. Please contact platform support.'
      });
      return;
    }

    // Update lastActive
    user.lastActive = new Date().toISOString();
    db.updateUser(user.id, { lastActive: user.lastActive });

    if (isMongoConnected()) {
      UserModel.findOneAndUpdate({ email: trimmedEmail }, { lastActive: user.lastActive }).catch(() => {});
    }

    // Generate JWT containing userId, role, and email
    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed.' });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user from JWT token
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    let user = db.getUserById(req.user.id);
    if (!user && isMongoConnected()) {
      const mongoUser = await UserModel.findOne({ id: req.user.id });
      if (mongoUser) {
        user = mongoUser.toObject() as User;
      }
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch user profile.' });
  }
};

/**
 * PUT /api/auth/profile
 * Update profile for authenticated user
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const updates = req.body;
    delete updates.id;
    delete updates.password;
    delete updates.role; // Role cannot be changed via profile update

    if (updates.email) {
      const existing = db.getUserByEmail(updates.email.trim().toLowerCase());
      if (existing && existing.id !== req.user.id) {
        res.status(400).json({ success: false, message: 'Email address is already in use by another account.' });
        return;
      }
    }

    const updated = db.updateUser(req.user.id, updates);

    if (isMongoConnected() && updated) {
      await UserModel.findOneAndUpdate({ id: req.user.id }, updates);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated ? sanitizeUser(updated) : null
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required.' });
      return;
    }

    // Return a uniform security message
    res.json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been dispatched.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/auth/switch-role
 * Developer/Admin role switcher (for sandbox/demo simulation)
 */
export const switchRole = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { role } = req.body;
    if (!role) {
      res.status(400).json({ success: false, message: 'Target role is required.' });
      return;
    }

    const clean = role.toLowerCase().replace('role_', '');
    const matching = db.getUsers().find(u => u.role.toLowerCase().replace('role_', '') === clean);
    if (matching) {
      const token = generateToken({ userId: matching.id, role: matching.role, email: matching.email });
      res.json({
        success: true,
        message: `Switched to user ${matching.name} (${clean})`,
        token,
        user: sanitizeUser(matching)
      });
    } else {
      res.status(404).json({ success: false, message: `No user found with role ${role}.` });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

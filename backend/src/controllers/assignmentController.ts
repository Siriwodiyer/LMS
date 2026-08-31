import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Assignment, AssignmentSubmission } from '../types/index.js';

export const getAssignments = (req: Request, res: Response): void => {
  try {
    const { courseId } = req.query;
    const assignments = db.getAssignments(courseId as string);
    res.json({ success: true, count: assignments.length, assignments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAssignmentById = (req: Request, res: Response): void => {
  try {
    const assignment = db.getAssignmentById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }
    res.json({ success: true, assignment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAssignment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const newAss: Assignment = {
      id: `ass-${Date.now()}`,
      courseId: data.courseId || 'course-1',
      courseTitle: data.courseTitle || 'Course Assignment',
      moduleId: data.moduleId || 'mod-1',
      moduleTitle: data.moduleTitle || 'Module 1',
      title: data.title || 'Course Capstone Assignment',
      instructions: data.instructions || '',
      dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      maxMarks: data.maxMarks || 100,
      submissionType: data.submissionType || 'code',
      submissions: [],
      createdAt: new Date().toISOString()
    };

    const saved = db.insertAssignment(newAss);
    res.status(201).json({ success: true, message: 'Assignment created successfully.', assignment: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAssignment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateAssignment(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }
    res.json({ success: true, message: 'Assignment updated successfully.', assignment: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAssignment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteAssignment(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }
    res.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitAssignment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id || req.body.userId || 'user-student';
    const user = db.getUserById(userId);

    const assignment = db.getAssignmentById(id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Submission content or URL cannot be empty.' });
      return;
    }

    const newSubmission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: id,
      userId,
      userName: user?.name || 'Student',
      submittedAt: new Date().toISOString(),
      content: content.trim(),
      status: 'pending'
    };

    const currentSubs = assignment.submissions || [];
    const filteredSubs = currentSubs.filter(s => s.userId !== userId);
    const updatedSubs = [newSubmission, ...filteredSubs];

    db.updateAssignment(id, { submissions: updatedSubs });

    // Update user activity & count
    if (user) {
      const assignmentsCompletedCount = (user.assignmentsCompletedCount || 0) + 1;
      db.updateUser(userId, {
        assignmentsCompletedCount,
        recentActivity: [
          {
            id: `act-${Date.now()}`,
            type: 'assignment',
            title: `Submitted: ${assignment.title}`,
            description: 'Assignment submitted for mentor review.',
            timestamp: 'Just now'
          },
          ...(user.recentActivity || [])
        ]
      });
    }

    res.json({
      success: true,
      message: 'Assignment submitted successfully for instructor evaluation!',
      submission: newSubmission
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const gradeSubmission = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id: assignmentId, submissionId } = req.params;
    const { grade, feedback } = req.body;

    const assignment = db.getAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found.' });
      return;
    }

    const submissions = assignment.submissions || [];
    const subIndex = submissions.findIndex(s => s.id === submissionId);
    if (subIndex === -1) {
      res.status(404).json({ success: false, message: 'Submission not found.' });
      return;
    }

    submissions[subIndex] = {
      ...submissions[subIndex],
      marksAwarded: Number(grade),
      feedback: feedback || 'Graded by instructor',
      status: 'graded'
    };

    db.updateAssignment(assignmentId, { submissions });

    // Notify student
    const studentId = submissions[subIndex].userId;
    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: studentId,
      title: `📝 Assignment Graded: ${assignment.title}`,
      message: `You received ${grade}/${assignment.maxMarks} marks. Mentor feedback: "${feedback || 'Great work!'}"`,
      type: 'assessment',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Submission graded successfully.',
      submission: submissions[subIndex]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

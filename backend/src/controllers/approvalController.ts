import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ContentApprovalItem, ApprovalStatus } from '../types/index.js';

export const getApprovalQueue = (req: Request, res: Response): void => {
  try {
    const { status, contentType } = req.query;
    let queue = db.getApprovalQueue();

    if (status && typeof status === 'string') {
      queue = queue.filter((item: ContentApprovalItem) => item.status === status);
    }
    if (contentType && typeof contentType === 'string') {
      queue = queue.filter((item: ContentApprovalItem) => item.contentType === contentType);
    }

    res.json({ success: true, count: queue.length, approvalQueue: queue });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitContentForApproval = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const creatorId = req.user?.id || data.creatorId || 'user-mentor';
    const creatorUser = db.getUserById(creatorId);

    const newItem: ContentApprovalItem = {
      id: `appr-${Date.now()}`,
      contentType: data.contentType || 'course',
      contentId: data.contentId || `content-${Date.now()}`,
      title: data.title || 'Untitled Content',
      categoryOrSubject: data.categoryOrSubject || 'General',
      creatorId,
      creatorName: creatorUser?.name || data.creatorName || 'Creator',
      creatorRole: creatorUser?.role === 'admin' ? 'Admin' : 'Mentor',
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: 'System Gateway',
          action: 'submitted',
          feedback: 'Submitted content for curriculum & pedagogical review.'
        }
      ]
    };

    const saved = db.insertApprovalItem(newItem);
    res.status(201).json({ success: true, message: 'Content submitted for review.', approvalItem: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveContent = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { publishImmediately } = req.body;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const item = db.getApprovalItemById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Approval item not found.' });
      return;
    }

    const newStatus: ApprovalStatus = publishImmediately ? 'published' : 'approved';
    const updated = db.updateApprovalItem(id, {
      status: newStatus,
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName,
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: reviewerName,
          action: publishImmediately ? 'published' : 'approved',
          feedback: publishImmediately ? 'Approved and published directly to platform catalog.' : 'Approved for publication.'
        },
        ...(item.feedbackHistory || [])
      ]
    });

    // If it's a course, update the course status in database as well
    if (item.contentType === 'course') {
      db.updateCourse(item.contentId, {
        status: newStatus
      });
    }

    // If it's a reel, ensure reel is published
    if (item.contentType === 'reel') {
      db.updateReel(item.contentId, {
        isPublished: true
      });
    }

    // Notify creator
    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: item.creatorId,
      title: `🎉 Content Approved: "${item.title}"`,
      message: `Your submitted ${item.contentType} has been reviewed and approved by ${reviewerName}.`,
      type: 'approval',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Content ${publishImmediately ? 'approved and published' : 'approved'}.`,
      approvalItem: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectContent = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const item = db.getApprovalItemById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Approval item not found.' });
      return;
    }

    const updated = db.updateApprovalItem(id, {
      status: 'rejected',
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName,
      rejectionReason: reason,
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: reviewerName,
          action: 'rejected',
          feedback: reason || 'Content does not meet current curriculum guidelines.'
        },
        ...(item.feedbackHistory || [])
      ]
    });

    if (item.contentType === 'course') {
      db.updateCourse(item.contentId, {
        status: 'rejected',
        rejectionFeedback: reason
      });
    }

    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: item.creatorId,
      title: `Content Review Update: "${item.title}"`,
      message: `Content was rejected. Feedback: "${reason || 'Please check feedback notes.'}"`,
      type: 'approval',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Content rejected.', approvalItem: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestChanges = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const item = db.getApprovalItemById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Approval item not found.' });
      return;
    }

    const updated = db.updateApprovalItem(id, {
      status: 'changes_requested',
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName,
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: reviewerName,
          action: 'requested_changes',
          feedback: feedback || 'Please review requested curriculum revisions.'
        },
        ...(item.feedbackHistory || [])
      ]
    });

    if (item.contentType === 'course') {
      db.updateCourse(item.contentId, {
        status: 'changes_requested',
        rejectionFeedback: feedback
      });
    }

    db.insertNotification({
      id: `notif-${Date.now()}`,
      userId: item.creatorId,
      title: `Changes Requested on "${item.title}"`,
      message: `Admin review requested updates: "${feedback || 'Please review items.'}"`,
      type: 'approval',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Changes requested successfully.', approvalItem: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const publishDirectly = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const reviewerName = req.user ? (db.getUserById(req.user.id)?.name || 'Administrator') : 'Administrator';

    const item = db.getApprovalItemById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Approval item not found.' });
      return;
    }

    const updated = db.updateApprovalItem(id, {
      status: 'published',
      reviewedDate: new Date().toISOString(),
      reviewedBy: reviewerName,
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: reviewerName,
          action: 'published',
          feedback: 'Content published directly by Administrator.'
        },
        ...(item.feedbackHistory || [])
      ]
    });

    if (item.contentType === 'course') {
      db.updateCourse(item.contentId, { status: 'published' });
    }
    if (item.contentType === 'reel') {
      db.updateReel(item.contentId, { isPublished: true });
    }

    res.json({ success: true, message: 'Content published directly to platform.', approvalItem: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

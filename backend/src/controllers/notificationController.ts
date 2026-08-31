import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getNotifications = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = (req.query.userId as string) || req.user?.id || 'user-student';
    const notifs = db.getNotifications(userId);
    res.json({ success: true, count: notifs.length, notifications: notifs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updated = db.updateNotification(id, { read: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Notification not found.' });
      return;
    }
    res.json({ success: true, notification: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearAll = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id || (req.body.userId as string) || 'user-student';
    db.clearUserNotifications(userId);
    res.json({ success: true, message: 'All notifications cleared.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

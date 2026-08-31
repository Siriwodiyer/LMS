import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getSettings = (req: Request, res: Response): void => {
  try {
    const settings = db.getAdminSettings();
    res.json({ success: true, adminSettings: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const updates = req.body;
    const updated = db.updateAdminSettings(updates);
    res.json({ success: true, message: 'Platform settings updated successfully.', adminSettings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

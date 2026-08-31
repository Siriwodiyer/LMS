import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const users = db.getUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = (req: Request, res: Response): void => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateUser(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, message: 'User updated successfully.', user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleUserStatus = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = db.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updated = db.updateUser(id, { status: newStatus });
    res.json({ success: true, message: `User status changed to ${newStatus}.`, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserActivity = (req: Request, res: Response): void => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, activity: user.recentActivity || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

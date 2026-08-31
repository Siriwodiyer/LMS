import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { BadgeDefinition, DiscountVoucher } from '../types/index.js';

export const getBadgeDefinitions = (req: Request, res: Response): void => {
  try {
    const badges = db.getBadgeDefinitions();
    res.json({ success: true, count: badges.length, badgeDefinitions: badges });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createBadgeDefinition = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const newBadge: BadgeDefinition = {
      id: `badge-def-${Date.now()}`,
      title: data.title || 'New Skill Badge',
      description: data.description || '',
      icon: data.icon || '🏅',
      rarity: data.rarity || 'common',
      conditionType: data.conditionType || 'custom',
      conditionCourseId: data.conditionCourseId,
      conditionThreshold: data.conditionThreshold || 80,
      conditionText: data.conditionText || 'Complete specified requirements',
      isActive: data.isActive !== undefined ? data.isActive : true,
      earnedCount: 0,
      createdAt: new Date().toISOString()
    };

    const saved = db.insertBadgeDefinition(newBadge);
    res.status(201).json({ success: true, message: 'Badge definition created successfully.', badgeDefinition: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBadgeDefinition = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateBadgeDefinition(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Badge definition not found.' });
      return;
    }
    res.json({ success: true, message: 'Badge definition updated.', badgeDefinition: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBadgeActive = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const badge = db.getBadgeDefinitions().find(b => b.id === id);
    if (!badge) {
      res.status(404).json({ success: false, message: 'Badge definition not found.' });
      return;
    }

    const updated = db.updateBadgeDefinition(id, { isActive: !badge.isActive });
    res.json({ success: true, message: `Badge ${updated?.isActive ? 'activated' : 'deactivated'}.`, badgeDefinition: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserBadges = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = (req.query.userId as string) || req.user?.id || 'user-student';
    const user = db.getUserById(userId);
    res.json({ success: true, badges: user?.badges || db.getBadges() });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVouchers = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = (req.query.userId as string) || req.user?.id || 'user-student';
    const user = db.getUserById(userId);
    const vouchers = user?.discountVouchers || db.getVouchers();
    res.json({ success: true, count: vouchers.length, vouchers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const redeemVoucher = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Voucher code is required.' });
      return;
    }

    const upper = code.trim().toUpperCase();
    const voucher = db.getVouchers().find(v => v.code.toUpperCase() === upper);

    if (!voucher) {
      res.status(404).json({ success: false, message: 'Invalid voucher code.' });
      return;
    }

    if (voucher.isUsed) {
      res.status(400).json({ success: false, message: 'This voucher code has already been redeemed.' });
      return;
    }

    res.json({
      success: true,
      discountPercent: voucher.discountPercent,
      voucher,
      message: `Promo code applied! ${voucher.discountPercent}% discount activated.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

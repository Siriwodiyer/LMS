import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { UserRole } from '../types/index.js';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const normalize = (r: string) => r.toLowerCase().replace('role_', '');
    const userRoleNorm = normalize(req.user.role);
    const allowedNorm = allowedRoles.map(r => normalize(r));

    // Admin has access to everything
    if (userRoleNorm === 'admin' || allowedNorm.includes(userRoleNorm)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Your role is ${req.user.role}.`
    });
  };
};

export const requireAdmin = requireRole(['admin', 'ROLE_ADMIN']);
export const requireMentor = requireRole(['mentor', 'ROLE_MENTOR', 'admin', 'ROLE_ADMIN']);

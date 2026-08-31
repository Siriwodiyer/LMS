import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload, UserRole } from '../types/index.js';
import { db } from '../config/database.js';
import { UserModel } from '../models/index.js';
import { isMongoConnected } from '../config/mongo.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'lms_super_secret_jwt_key_2026_prototype_secure';

export const generateToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. No Bearer token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    let user = db.getUserById(decoded.userId);

    if (!user && isMongoConnected()) {
      const mongoUser = await UserModel.findOne({ id: decoded.userId });
      if (mongoUser) {
        user = mongoUser.toObject() as any;
      }
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token: User no longer exists.' });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email
    };
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    let user = db.getUserById(decoded.userId);
    if (!user && isMongoConnected()) {
      const mongoUser = await UserModel.findOne({ id: decoded.userId });
      if (mongoUser) user = mongoUser.toObject() as any;
    }

    if (user) {
      req.user = {
        id: user.id,
        role: user.role,
        email: user.email
      };
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
};

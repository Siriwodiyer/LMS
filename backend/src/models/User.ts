import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '../types/index.js';

export interface UserDocument extends Omit<IUser, 'id'>, Document {
  id: string;
}

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: false },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['student', 'mentor', 'admin', 'learner', 'seller', 'ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_LEARNER'],
      default: 'student'
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'pending_approval', 'rejected', 'inactive', 'suspended'],
      default: 'active'
    },
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    isEligibleForMentor: { type: Boolean, default: false },
    mentorApplicationId: { type: String },
    bio: { type: String, default: '' },
    specialty: { type: String, default: '' },
    assignedMentorId: { type: String },
    assignedMentorName: { type: String },
    assignedLearnerIds: [{ type: String }],
    enrolledCourseIds: [{ type: String }],
    completedCourseIds: [{ type: String }],
    badges: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        unlockedAt: { type: String },
        rarity: { type: String, default: 'common' }
      }
    ],
    discountVouchers: [
      {
        id: { type: String, required: true },
        code: { type: String, required: true },
        discountPercent: { type: Number, required: true },
        description: { type: String },
        expiresAt: { type: String },
        isUsed: { type: Boolean, default: false }
      }
    ],
    weeklyHours: [{ type: Number }],
    recentActivity: [
      {
        id: { type: String },
        type: { type: String },
        title: { type: String },
        description: { type: String },
        timestamp: { type: String },
        scoreOrPoints: { type: String }
      }
    ],
    registeredAt: { type: String, default: () => new Date().toISOString() },
    lastActive: { type: String, default: () => new Date().toISOString() },
    totalLearningHours: { type: Number, default: 0 },
    quizAverage: { type: Number, default: 0 },
    completedLessonsCount: { type: Number, default: 0 },
    reelsWatchedTotal: { type: Number, default: 0 },
    assignmentsCompletedCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;

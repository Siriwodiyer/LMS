import mongoose, { Schema, Document } from 'mongoose';
import { AdminSettings as IAdminSettings, AssessmentResult as IAssessmentResult } from '../types/index.js';

export interface AdminSettingsDocument extends IAdminSettings, Document {}

export interface AssessmentResultDocument extends Omit<IAssessmentResult, 'id'>, Document {
  id: string;
}

const AdminSettingsSchema = new Schema(
  {
    key: { type: String, default: 'global_settings', unique: true, index: true },
    passingScoreThreshold: { type: Number, default: 80 },
    reelsPerAssessment: { type: Number, default: 6 },
    pointsPerCorrectAnswer: { type: Number, default: 50 },
    streakBonusMultiplier: { type: Number, default: 1.5 },
    mentorEligibilityMinAssessments: { type: Number, default: 3 },
    mentorEligibilityMinScore: { type: Number, default: 80 },
    mentorEligibilityAvgScore: { type: Number, default: 85 }
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

const AssessmentResultSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    reelIds: [{ type: String }],
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    scorePercent: { type: Number, required: true },
    pointsEarned: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    passed: { type: Boolean, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    unlockedBadge: {
      id: { type: String },
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      rarity: { type: String }
    },
    unlockedVoucher: {
      id: { type: String },
      code: { type: String },
      discountPercent: { type: Number },
      description: { type: String }
    },
    mentorEligibleNow: { type: Boolean, default: false }
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

export const AdminSettingsModel = mongoose.models.AdminSettings || mongoose.model<AdminSettingsDocument>('AdminSettings', AdminSettingsSchema);
export const AssessmentResultModel = mongoose.models.AssessmentResult || mongoose.model<AssessmentResultDocument>('AssessmentResult', AssessmentResultSchema);

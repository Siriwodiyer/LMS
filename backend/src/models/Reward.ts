import mongoose, { Schema, Document } from 'mongoose';
import { BadgeDefinition as IBadgeDefinition, DiscountVoucher as IDiscountVoucher } from '../types/index.js';

export interface BadgeDefinitionDocument extends Omit<IBadgeDefinition, 'id'>, Document {
  id: string;
}

export interface DiscountVoucherDocument extends Omit<IDiscountVoucher, 'id'>, Document {
  id: string;
}

const BadgeDefinitionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Award' },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    conditionType: {
      type: String,
      enum: ['quiz_score', 'reels_watched', 'course_completion', 'streak_days', 'custom'],
      default: 'reels_watched'
    },
    conditionCourseId: { type: String },
    conditionThreshold: { type: Number },
    conditionText: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    earnedCount: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() }
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

const DiscountVoucherSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountPercent: { type: Number, required: true },
    description: { type: String, default: '' },
    expiresAt: { type: String, default: '2026-12-31T23:59:59Z' },
    isUsed: { type: Boolean, default: false }
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

export const BadgeDefinitionModel = mongoose.models.BadgeDefinition || mongoose.model<BadgeDefinitionDocument>('BadgeDefinition', BadgeDefinitionSchema);
export const DiscountVoucherModel = mongoose.models.DiscountVoucher || mongoose.model<DiscountVoucherDocument>('DiscountVoucher', DiscountVoucherSchema);

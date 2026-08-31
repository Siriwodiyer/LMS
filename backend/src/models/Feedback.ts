import mongoose, { Schema, Document } from 'mongoose';
import { CourseFeedback, PlatformFeedbackItem, Comment as IComment } from '../types/index.js';

export interface CourseFeedbackDocument extends Omit<CourseFeedback, 'id'>, Document {
  id: string;
}

export interface PlatformFeedbackDocument extends Omit<PlatformFeedbackItem, 'id'>, Document {
  id: string;
}

export interface CommentDocument extends Omit<IComment, 'id'>, Document {
  id: string;
}

const CourseFeedbackSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    courseId: { type: String, required: true, index: true },
    courseTitle: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
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

const PlatformFeedbackSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, default: 'General Experience' },
    comment: { type: String, required: true },
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

const CommentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    reelId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
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

export const CourseFeedbackModel = mongoose.models.CourseFeedback || mongoose.model<CourseFeedbackDocument>('CourseFeedback', CourseFeedbackSchema);
export const PlatformFeedbackModel = mongoose.models.PlatformFeedback || mongoose.model<PlatformFeedbackDocument>('PlatformFeedback', PlatformFeedbackSchema);
export const CommentModel = mongoose.models.Comment || mongoose.model<CommentDocument>('Comment', CommentSchema);

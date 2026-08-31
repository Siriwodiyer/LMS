import mongoose, { Schema, Document } from 'mongoose';
import { ContentApprovalItem as IApproval, MentorApplication as IMentorApp } from '../types/index.js';

export interface ApprovalDocument extends Omit<IApproval, 'id'>, Document {
  id: string;
}

export interface MentorApplicationDocument extends Omit<IMentorApp, 'id'>, Document {
  id: string;
}

const FeedbackHistorySchema = new Schema({
  date: { type: String, required: true },
  adminName: { type: String, required: true },
  action: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected', 'requested_changes', 'published'],
    required: true
  },
  feedback: { type: String, default: '' }
});

const ApprovalSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    contentType: {
      type: String,
      enum: ['course', 'reel', 'lesson', 'quiz', 'assignment', 'article'],
      required: true
    },
    contentId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    categoryOrSubject: { type: String, default: 'General' },
    creatorId: { type: String, required: true },
    creatorName: { type: String, required: true },
    creatorRole: { type: String, default: 'Mentor' },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'pending_review', 'changes_requested', 'approved', 'rejected', 'published'],
      default: 'submitted',
      index: true
    },
    submissionDate: { type: String, default: () => new Date().toISOString() },
    reviewedDate: { type: String },
    reviewedBy: { type: String },
    rejectionReason: { type: String },
    feedbackHistory: [FeedbackHistorySchema]
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

const MentorApplicationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantAvatar: { type: String, default: '' },
    expertise: { type: String, required: true },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 1 },
    bio: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    assessmentsCompleted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'changes_requested', 'approved', 'rejected'],
      default: 'submitted',
      index: true
    },
    submissionDate: { type: String, default: () => new Date().toISOString() },
    reviewedDate: { type: String },
    reviewedBy: { type: String },
    adminFeedback: { type: String }
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

export const ApprovalModel = mongoose.models.Approval || mongoose.model<ApprovalDocument>('Approval', ApprovalSchema);
export const MentorApplicationModel = mongoose.models.MentorApplication || mongoose.model<MentorApplicationDocument>('MentorApplication', MentorApplicationSchema);

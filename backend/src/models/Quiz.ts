import mongoose, { Schema, Document } from 'mongoose';
import { Quiz as IQuiz, Assignment as IAssignment } from '../types/index.js';

export interface QuizDocument extends Omit<IQuiz, 'id'>, Document {
  id: string;
}

export interface AssignmentDocument extends Omit<IAssignment, 'id'>, Document {
  id: string;
}

const QuizQuestionSchema = new Schema({
  id: { type: String, required: true },
  reelId: { type: String },
  courseId: { type: String },
  moduleId: { type: String },
  category: { type: String, default: 'General' },
  type: { type: String, enum: ['mcq', 'true_false'], default: 'mcq' },
  prompt: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
  difficulty: { type: String, default: 'Beginner' },
  marks: { type: Number, default: 10 }
});

const QuizSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    courseId: { type: String, index: true },
    moduleId: { type: String },
    creatorId: { type: String, default: 'system' },
    creatorName: { type: String, default: 'LMS Faculty' },
    questions: [QuizQuestionSchema],
    passingScorePercent: { type: Number, default: 80 },
    timeLimitMinutes: { type: Number, default: 15 },
    status: { type: String, default: 'published' },
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

const SubmissionSchema = new Schema({
  id: { type: String, required: true },
  assignmentId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  grade: { type: Number },
  feedback: { type: String },
  gradedBy: { type: String },
  gradedAt: { type: String },
  status: { type: String, enum: ['pending', 'graded', 'resubmit_requested'], default: 'pending' }
});

const AssignmentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    courseId: { type: String, index: true },
    moduleId: { type: String },
    creatorId: { type: String, default: 'system' },
    creatorName: { type: String, default: 'LMS Faculty' },
    instructions: { type: String, default: '' },
    maxScore: { type: Number, default: 100 },
    dueDate: { type: String },
    submissions: [SubmissionSchema],
    status: { type: String, default: 'published' },
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

export const QuizModel = mongoose.models.Quiz || mongoose.model<QuizDocument>('Quiz', QuizSchema);
export const AssignmentModel = mongoose.models.Assignment || mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);

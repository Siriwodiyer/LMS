import mongoose, { Schema, Document } from 'mongoose';
import { Reel as IReel } from '../types/index.js';

export interface ReelDocument extends Omit<IReel, 'id'>, Document {
  id: string;
}

const QuestionSchema = new Schema({
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

const ReelSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    topic: { type: String, default: 'General' },
    subject: { type: String, default: 'Computer Science' },
    creatorId: { type: String, default: 'system' },
    creatorName: { type: String, default: 'LMS Faculty' },
    creatorAvatar: { type: String, default: '' },
    creatorRole: { type: String, default: 'Mentor' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    durationSeconds: { type: Number, default: 60 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String }],
    questions: [QuestionSchema],
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

export const ReelModel = mongoose.models.Reel || mongoose.model<ReelDocument>('Reel', ReelSchema);
export default ReelModel;

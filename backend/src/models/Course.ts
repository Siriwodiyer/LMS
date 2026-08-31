import mongoose, { Schema, Document } from 'mongoose';
import { Course as ICourse } from '../types/index.js';

export interface CourseDocument extends Omit<ICourse, 'id'>, Document {
  id: string;
}

const LessonSchema = new Schema({
  id: { type: String, required: true },
  courseId: { type: String },
  moduleId: { type: String },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  learningObjectives: [{ type: String }],
  supportingContent: { type: String },
  estimatedDurationMinutes: { type: Number, default: 5 },
  order: { type: Number, default: 1 },
  viewsCount: { type: Number, default: 0 },
  isFreePreview: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const CourseModuleSchema = new Schema({
  id: { type: String, required: true },
  courseId: { type: String },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  durationMinutes: { type: Number, default: 30 },
  videoUrl: { type: String },
  isFreePreview: { type: Boolean, default: false },
  order: { type: Number, default: 1 },
  lessons: [LessonSchema]
});

const CourseReelSchema = new Schema({
  id: { type: String, required: true },
  courseId: { type: String },
  order: { type: Number, default: 1 },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  topic: { type: String },
  durationSeconds: { type: Number, default: 60 },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  likesCount: { type: Number, default: 0 }
});

const CourseSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: 'Technology' },
    price: { type: Number, default: 0 },
    discountedPrice: { type: Number },
    instructorId: { type: String, required: true },
    instructorName: { type: String, required: true },
    instructorAvatar: { type: String, default: '' },
    instructorBio: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'Beginner' },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    modules: [CourseModuleSchema],
    reels: [CourseReelSchema],
    learningOutcomes: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'pending_review', 'changes_requested', 'approved', 'rejected', 'published'],
      default: 'published'
    },
    rejectionFeedback: { type: String },
    submittedAt: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    durationHours: { type: Number, default: 2 },
    progressPercent: { type: Number, default: 0 },
    lastLessonTitle: { type: String },
    lessonsCount: { type: Number, default: 0 },
    reelsCount: { type: Number, default: 0 },
    quizzesCount: { type: Number, default: 0 },
    assignmentsCount: { type: Number, default: 0 }
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

export const CourseModel = mongoose.models.Course || mongoose.model<CourseDocument>('Course', CourseSchema);
export default CourseModel;

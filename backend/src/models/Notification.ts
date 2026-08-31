import mongoose, { Schema, Document } from 'mongoose';
import { NotificationItem as INotification } from '../types/index.js';

export interface NotificationDocument extends Omit<INotification, 'id'>, Document {
  id: string;
}

const NotificationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['assessment', 'reward', 'mentor', 'course', 'system', 'seller', 'approval'],
      default: 'system'
    },
    read: { type: Boolean, default: false, index: true },
    actionUrl: { type: String },
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

export const NotificationModel = mongoose.models.Notification || mongoose.model<NotificationDocument>('Notification', NotificationSchema);
export default NotificationModel;

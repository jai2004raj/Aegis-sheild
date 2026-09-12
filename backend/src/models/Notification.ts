import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId; // Ref User or Worker
  title: string;
  message: string;
  type: 'ASSIGNMENT' | 'TRANSFER' | 'SHIFT' | 'SALARY' | 'ANNOUNCEMENT';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['ASSIGNMENT', 'TRANSFER', 'SHIFT', 'SALARY', 'ANNOUNCEMENT'],
      default: 'ANNOUNCEMENT',
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);

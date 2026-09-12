import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  reviewerName: string;
  reviewerOrg?: string;
  rating: number; // 1 to 5
  title: string;
  review: string;
  serviceType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    reviewerName: { type: String, required: true },
    reviewerOrg: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    review: { type: String, required: true },
    serviceType: { type: String, default: 'General Security' },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);

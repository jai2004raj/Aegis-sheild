import mongoose, { Schema, Document } from 'mongoose';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  serviceRequired: string;
  numberOfPersonnel: number;
  message: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    serviceRequired: { type: String, required: true, default: 'General Security' },
    numberOfPersonnel: { type: Number, default: 1 },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'NEW',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);

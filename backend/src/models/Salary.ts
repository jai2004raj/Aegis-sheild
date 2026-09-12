import mongoose, { Schema, Document } from 'mongoose';

export interface ISalary extends Document {
  workerId: mongoose.Types.ObjectId;
  month: string; // e.g. "September"
  year: number; // e.g. 2026
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PROCESSING';
  paymentDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalarySchema: Schema = new Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true, default: 18000 },
    allowances: { type: Number, default: 2000 },
    overtime: { type: Number, default: 0 },
    deductions: { type: Number, default: 500 },
    netSalary: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'PROCESSING'],
      default: 'PENDING',
    },
    paymentDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

SalarySchema.index({ workerId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<ISalary>('Salary', SalarySchema);

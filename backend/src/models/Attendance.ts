import mongoose, { Schema, Document } from 'mongoose';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';

export interface IAttendance extends Document {
  workerId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format for easy querying
  loginTime: Date;
  logoutTime?: Date;
  totalHours?: number;
  status: AttendanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    date: { type: String, required: true }, // e.g. "2026-09-01"
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date },
    totalHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE'],
      default: 'PRESENT',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Prevent multiple check-ins on same date
AttendanceSchema.index({ workerId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);

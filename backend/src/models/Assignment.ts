import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  workerId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  position: string; // e.g. Main Gate Guard, Supervisor, Patrol Officer
  shiftId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED' | 'CANCELLED';
  assignedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    position: { type: String, required: true, default: 'Security Personnel' },
    shiftId: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'TRANSFERRED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryStructure {
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface IWorker extends Document {
  workerId: string; // e.g. SEC-W101
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  gender?: string;
  dateOfBirth?: Date;
  designation: string; // e.g. Security Guard, Supervisor, Gunman, Patrol Officer, CCTV Operator
  skills: string[];
  joiningDate: Date;
  experience?: string;
  salaryStructure: ISalaryStructure;
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  currentAssignment?: mongoose.Types.ObjectId;
  profileImage?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema: Schema = new Schema(
  {
    workerId: { type: String, required: true, unique: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    designation: { type: String, required: true, default: 'Security Guard' },
    skills: [{ type: String }],
    joiningDate: { type: Date, default: Date.now },
    experience: { type: String, default: '1 Year' },
    salaryStructure: {
      baseSalary: { type: Number, required: true, default: 18000 },
      allowances: { type: Number, default: 2000 },
      deductions: { type: Number, default: 500 },
    },
    employmentStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'],
      default: 'ACTIVE',
    },
    currentAssignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    profileImage: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IWorker>('Worker', WorkerSchema);

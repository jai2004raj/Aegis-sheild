import mongoose, { Schema, Document } from 'mongoose';

export interface IShift extends Document {
  name: string; // e.g. Morning, Evening, Night
  startTime: string; // e.g. 06:00
  endTime: string; // e.g. 14:00
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IShift>('Shift', ShiftSchema);

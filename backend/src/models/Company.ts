import mongoose, { Schema, Document } from 'mongoose';

export type OrganizationType =
  | 'School'
  | 'College'
  | 'Company'
  | 'Apartment'
  | 'Hospital'
  | 'Warehouse'
  | 'Mall'
  | 'Factory'
  | 'Office'
  | 'Other';

export interface ICompany extends Document {
  companyId: string; // e.g. SEC-C201
  userId?: mongoose.Types.ObjectId;
  name: string;
  organizationType: OrganizationType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  requiredWorkers: number;
  workingHours?: string;
  requiredShift?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    companyId: { type: String, required: true, unique: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    organizationType: {
      type: String,
      required: true,
      enum: [
        'School',
        'College',
        'Company',
        'Apartment',
        'Hospital',
        'Warehouse',
        'Mall',
        'Factory',
        'Office',
        'Other',
      ],
      default: 'Company',
    },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, trim: true },
    requiredWorkers: { type: Number, required: true, default: 5 },
    workingHours: { type: Number, default: 8 },
    requiredShift: { type: String, default: 'Day & Night (24x7)' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);

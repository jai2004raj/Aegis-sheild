export type UserRole = 'ADMIN' | 'WORKER' | 'COMPANY' | 'CUSTOMER';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  isActive?: boolean;
  workerId?: string;
  companyId?: string;
}

export interface SalaryStructure {
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface Worker {
  _id: string;
  workerId: string;
  userId: string | User;
  name: string;
  phone: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  gender?: string;
  dateOfBirth?: string;
  designation: string;
  skills: string[];
  joiningDate: string;
  experience?: string;
  salaryStructure: SalaryStructure;
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  currentAssignment?: Assignment;
  profileImage?: string;
  photo?: string;
  createdAt?: string;
}

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

export interface Company {
  _id: string;
  companyId: string;
  userId?: string | User;
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
  workingHours?: number;
  requiredShift?: string;
  status: 'ACTIVE' | 'INACTIVE';
  activeWorkersCount?: number;
  createdAt?: string;
}

export interface Shift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface Assignment {
  _id: string;
  workerId: string | Worker;
  companyId: string | Company;
  position: string;
  shiftId: string | Shift;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED' | 'CANCELLED';
  assignedBy?: string;
  notes?: string;
  createdAt?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';

export interface Attendance {
  _id: string;
  workerId: string | Worker;
  companyId: string | Company;
  date: string;
  loginTime: string;
  logoutTime?: string;
  totalHours?: number;
  status: AttendanceStatus;
  notes?: string;
  createdAt?: string;
}

export interface Salary {
  _id: string;
  workerId: string | Worker;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PROCESSING';
  paymentDate?: string;
  notes?: string;
}

export interface Notification {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'ASSIGNMENT' | 'TRANSFER' | 'SHIFT' | 'SALARY' | 'ANNOUNCEMENT';
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  reviewerName: string;
  reviewerOrg?: string;
  companyId?: string | Company;
  rating: number;
  title: string;
  review: string;
  serviceType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  serviceRequired: string;
  numberOfPersonnel: number;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  notes?: string;
  createdAt: string;
}

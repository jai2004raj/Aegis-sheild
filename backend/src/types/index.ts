import { Request } from 'express';

export type UserRole = 'ADMIN' | 'WORKER' | 'COMPANY' | 'CUSTOMER';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  workerId?: string;
  companyId?: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

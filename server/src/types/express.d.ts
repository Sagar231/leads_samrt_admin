import type { UserRole } from '../modules/auth/auth.types';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: UserRole;
      email: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

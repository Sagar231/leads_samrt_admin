export const USER_ROLES = ['admin', 'sales'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

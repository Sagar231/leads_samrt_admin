import { http } from '@/lib/http';
import type { ApiSuccess } from '@/types/api';
import type { AuthResponse, User } from '@/types/auth';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await http.post<ApiSuccess<AuthResponse>>('/auth/register', payload);
  return data.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await http.post<ApiSuccess<AuthResponse>>('/auth/login', payload);
  return data.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await http.get<ApiSuccess<User>>('/auth/me');
  return data.data;
}

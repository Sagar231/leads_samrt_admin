import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { User } from './user.model';
import type { AuthTokenPayload, PublicUser } from './auth.types';
import type { LoginInput, RegisterInput } from './auth.validators';

const BCRYPT_ROUNDS = 12;

function signToken(payload: AuthTokenPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }
}

export async function register(input: RegisterInput): Promise<{ user: PublicUser; token: string }> {
  const existing = await User.findOne({ email: input.email }).lean();
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role ?? 'sales',
  });

  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
  return { user: user.toPublicJSON(), token };
}

export async function login(input: LoginInput): Promise<{ user: PublicUser; token: string }> {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  const ok = await user.comparePassword(input.password);
  if (!ok) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
  return { user: user.toPublicJSON(), token };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toPublicJSON();
}

import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { loginSchema, registerSchema } from './auth.validators';
import { loginHandler, meHandler, registerHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), registerHandler);
authRouter.post('/login', validate(loginSchema), loginHandler);
authRouter.get('/me', requireAuth, meHandler);

import authenticate from '@/middlewares/authenticate.middleware.js';
import validate from '@/middlewares/validate.middleware.js';
import { login, register } from '@/modules/auth/controllers/auth.controller.js';
import {
  loginSchema,
  registerSchema,
} from '@/modules/auth/validations/user.validate.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), authenticate, login);

export default authRouter;

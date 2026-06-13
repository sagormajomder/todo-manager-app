import validate from '@/middlewares/validate.middleware.js';
import { register } from '@/modules/auth/controllers/auth.controller.js';
import { registerSchema } from '@/modules/auth/validations/user.validate.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);

export default authRouter;

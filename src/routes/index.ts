import authRouter from '@/modules/auth/routes/auth.route.js';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);

export default router;

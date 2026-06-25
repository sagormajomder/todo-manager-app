import env from '@/config/env.js';
import { globalErrorHandler } from '@/middlewares/error.middleware.js';
import router from '@/routes/index.js';
import { ApiError } from '@/utils/ApiError.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';

const app = express();

// Server Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

//global middlewares
app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Api routes
app.use('/api/v1', router);

// 404 route
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound('Resource not found'));
});

// Global error handler — must be last
app.use(globalErrorHandler);

export default app;

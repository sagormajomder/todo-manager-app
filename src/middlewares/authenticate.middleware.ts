import authRepositories from '@/modules/auth/repositories/auth.repositories.js';
import asyncCatch from '@/utils/asyncCatch.js';
import { verifyAccessToken } from '@/utils/jwt.js';
import type { NextFunction, Request, Response } from 'express';

const repo = authRepositories();

const authenticate = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Invalid authentication');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.error('Invalid authentication');
      return;
    }

    const decodedToken = verifyAccessToken(token);
    const user = await repo.findById(decodedToken.id);

    if (!user) {
      console.error('Invalid authentication');
      return;
    }

    req.user = user;

    next();
  },
);

export default authenticate;

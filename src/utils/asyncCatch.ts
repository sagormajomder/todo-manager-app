import type { AsyncHandler } from '@/types/types.js';
import type { NextFunction, Request, Response } from 'express';

function asyncCatch(fn: AsyncHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

export default asyncCatch;

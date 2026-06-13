import type { NextFunction, Request, Response } from 'express';
import { type ZodObject } from 'zod';

const validate =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map(err => {
        return {
          field: err.path.length ? err.path.join('.') : 'unknown',
          message: err.message,
        };
      });

      return next(result.error);
    }

    const parsed = result.data;

    if ('body' in parsed) req.body = parsed.body;
    if ('params' in parsed) Object.assign(req.params, parsed.params);
    if ('query' in parsed) Object.assign(req.query, parsed.query);

    return next();
  };

export default validate;

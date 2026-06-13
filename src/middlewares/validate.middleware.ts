import type { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';
const validate =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if ('body' in parsed) req.body = parsed.body;
      if ('params' in parsed) Object.assign(req.params, parsed.params);
      if ('query' in parsed) Object.assign(req.query, parsed.query);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.length ? err.path.join('.') : 'unknown',
          message: err.message,
        }));

        console.error(errors);
        return next(error);
      }
      next(error);
    }
  };

export default validate;

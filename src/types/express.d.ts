import type { IUser } from '../types/types.ts';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

import type { NextFunction, Request, Response } from 'express';
import type { Document } from 'mongoose';

export type TPayload = {
  id: string;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export type UserPublicData = {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
};

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type DecodeToken = {
  id: string;
  iat: number;
  exp: number;
};

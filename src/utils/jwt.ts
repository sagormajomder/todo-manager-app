import env from '@/config/env.js';
import type { TPayload } from '@/types/types.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const generateAccessToken = (payload: TPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_TOKEN) as JwtPayload;

export const generateRefreshToken = (payload: TPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_TOKEN) as JwtPayload;

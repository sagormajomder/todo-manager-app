import env from '@/config/env.js';
import type { TPayload } from '@/types/types.js';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: TPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });

export const generateRefreshToken = (payload: TPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });

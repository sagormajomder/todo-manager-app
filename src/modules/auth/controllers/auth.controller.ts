import authServices from '@/modules/auth/services/auth.service.js';
import type { UserPublicData } from '@/types/types.js';
import { ApiResponse } from '@/utils/ApiResponse.js';
import { HTTP_STATUS } from '@/utils/constants.js';
import type { Request, Response } from 'express';

const service = authServices();

export const register = async (req: Request, res: Response) => {
  const result = await service.register(req.body);
  new ApiResponse<UserPublicData>(
    HTTP_STATUS.CREATED,
    result,
    'User is created successfully',
  ).send(res);
};

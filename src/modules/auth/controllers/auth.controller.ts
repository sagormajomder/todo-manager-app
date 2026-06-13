import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  res.status(201).json({
    success: true,
    message: 'User registration successful',
  });
};

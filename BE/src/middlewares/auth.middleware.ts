// eslint-disable @typescript-eslint/no-unsafe-assignment
import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import httpCode from 'http-status-codes';
import { Request } from '../types/custom';
import { verifyAccessToken } from '../utils/jwt.util';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const accessToken = req.cookies['access-token'] as string;
  if (!accessToken) {
    return res.status(httpCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
  const payload = verifyAccessToken(accessToken);
  if (!payload) {
    return res.status(httpCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  req.userId = (payload as JwtPayload)._id;
  next();
};

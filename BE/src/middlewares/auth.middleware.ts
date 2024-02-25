import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['access-token'];
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const payload = verifyAccessToken(accessToken);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

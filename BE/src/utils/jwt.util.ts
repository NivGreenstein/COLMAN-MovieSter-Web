import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { createRefreshToken } from '../services/refreshToken.service';

const { ACCESS_TOKEN_SECRET: accessTokenSecret = '', REFRESH_TOKEN_SECRET: refreshTokenSecret = '' } = process.env;
const ACCESS_TOKEN_LIFE = '15m';
const REFRESH_TOKEN_LIFE = '1d';
const REFRESH_TOKEN_LIFE_IN_SECONDS = 60 * 60 * 24;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error('Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET in .env file');
}

export function generateAccessToken(user: User): string {
  return jwt.sign({ ...user }, accessTokenSecret, { expiresIn: ACCESS_TOKEN_LIFE });
}

export async function generateRefreshToken(user: User): Promise<string> {
  const token = jwt.sign({ ...user }, refreshTokenSecret, { expiresIn: REFRESH_TOKEN_LIFE });

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFE_IN_SECONDS * 1000);
  await createRefreshToken(token, user._id!!, expiresAt);

  return token;
}

export function verifyRefreshTokenWithSecret(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (e) {
    return null;
  }
}

export function verifyAccessToken(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, accessTokenSecret);
  } catch (e) {
    return null;
  }
}

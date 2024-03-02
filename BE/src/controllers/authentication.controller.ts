/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from 'express';
import httpCode from 'http-status-codes';
import { z } from 'zod';
import { generateAccessToken as generateAccessTokenUtil, verifyRefreshTokenWithSecret } from '../utils/jwt.util';
import { User } from '../models/user.model';
import * as authService from '../services/auth.service';
import { ErrorResponse } from '../Globals';
import { createUser } from './user.controller';
import { getUserById } from '../services/user.service';

export type UserLogin = RequestHandler<{ email: string; password: string }, undefined | ErrorResponse>;
export type UserLogout = RequestHandler<undefined, undefined | ErrorResponse>;
export type UserGenereateAccessToken = RequestHandler<undefined, undefined | ErrorResponse>;

export const register = createUser;

export const login: UserLogin = async (req, res) => {
  try {
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
      .strict()
      .parse(req.body);

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result) {
      return res.status(httpCode.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    res.cookie('access-token', result.accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refresh-token', result.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(httpCode.OK).send();
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json(err);
    }
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout: UserLogout = async (req, res) => {
  const revokeTokenResult = authService.logout(req.cookies['refresh-token']);

  if (!revokeTokenResult) {
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }

  res.clearCookie('access-token');
  res.clearCookie('refresh-token');
  return res.status(httpCode.OK).send();
};

export const generateAccessToken: UserGenereateAccessToken = async (req, res) => {
  const refreshToken = req.cookies['refresh-token'];
  if (!refreshToken) {
    return res.status(httpCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }

  const payload = verifyRefreshTokenWithSecret(refreshToken);
  if (!payload || typeof payload === 'string') {
    return res.status(httpCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }

  const user = await getUserById(payload._id);
  if (!user) {
    return res.status(httpCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
  const accessToken = generateAccessTokenUtil(user as User);

  res.cookie('access-token', accessToken, {
    maxAge: 1000 * 60 * 15,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  return res.status(httpCode.OK).send();
};

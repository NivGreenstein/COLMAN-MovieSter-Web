/* eslint-disable @typescript-eslint/no-misused-promises */
import { ZodError, z } from 'zod';
import httpCode from 'http-status-codes';
import { RequestHandler } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { ErrorResponse } from '../Globals';
import * as service from '../services/user.service';
import { User, UserMongoDB, UserRegister, userRegisterSchema, userSchema } from '../models/user.model';

export type PartialUserUpdate = WithId<Partial<User>>;
export type UserUpdate = RequestHandler<PartialUserUpdate, undefined | ErrorResponse>;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type UserCreate = RequestHandler<UserRegister, { _id: string | ObjectId } | ErrorResponse>;
export type UserDelete = RequestHandler<{ id: string }, undefined | ErrorResponse>;
export type UserGetById = RequestHandler<{ id: string }, WithId<UserMongoDB> | ErrorResponse>;
export type UserGetByEmail = RequestHandler<{ email: string }, WithId<UserMongoDB> | ErrorResponse>;

export const updateUser: UserUpdate = async (req, res): Promise<void> => {
  try {
    const user = req.body as PartialUserUpdate;

    userSchema
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .extend({ _id: z.string().regex(/^[0-9a-fA-F]{24}$/) })
      .strict()
      .partial()
      .parse(user);

    //@ts-ignore
    if (user._id !== req.userId) {
      res.status(httpCode.FORBIDDEN).json({ message: 'Forbidden' });
      return;
    }

    const result = await service.updateUser(user);

    if (result.matchedCount === 0) {
      res.status(httpCode.NOT_FOUND).json({ message: 'User not found' });
      return;
    }
    res.status(httpCode.NO_CONTENT).send();
    return;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(httpCode.BAD_REQUEST).json({ message: err.issues });
      return;
    }
    if (err instanceof Error) {
      res.status(httpCode.BAD_REQUEST).json({ message: err.message });
      return;
    }
    res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    return;
  }
};

export const getUserById: UserGetById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await service.getUserById(id);
    if (!result) {
      return res.status(httpCode.NOT_FOUND).json({ message: 'User not found' });
    }
    return res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const getUserByEmail: UserGetByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await service.getUserByEmail(email);

    if (!result) {
      return res.status(httpCode.NOT_FOUND).json({ message: 'User not found' });
    }

    return res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const createUser: UserCreate = async (req, res) => {
  try {
    const user = req.body as UserRegister;

    userRegisterSchema.parse(user);

    const result = await service.createUser(user);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return res.status(httpCode.CREATED).json({ _id: result });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.issues });
    }
    if (err instanceof Error) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const getCurrentUser: RequestHandler<undefined, WithId<UserMongoDB> | ErrorResponse> = async (req, res) => {
  const accessToken = req.cookies['access-token'] as string;

  const userTokenData = JSON.parse(atob(accessToken.split('.')[1])) as WithId<UserMongoDB>;
  const id = userTokenData?._id?.toString();
  if (!id) {
    return res.status(httpCode.BAD_REQUEST).json({ message: 'Invalid token' });
  }
  const user = await service.getUserById(id);
  if (!user) {
    return res.status(httpCode.NOT_FOUND).json({ message: 'User not found' });
  }
  return res.json(user);
};

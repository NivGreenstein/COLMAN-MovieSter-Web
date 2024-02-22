import e, { Request, Response } from 'express';
import { User, UserSchema } from '../models/user.model';
import * as service from '../services/user.service';
import { ZodError } from 'zod';
import httpCode from 'http-status-codes';
import { RequestHandler } from 'express';
import { errorResponse } from '../Globals';
import { WithId } from 'mongodb';

export type PartialUserUpdate = { _id: string } & Partial<User>;
export type UserWithPassword = User & { password: string };
export type UserUpdate = RequestHandler<PartialUserUpdate, undefined | errorResponse>;
export type UserCreate = RequestHandler<UserWithPassword, undefined | errorResponse>;
export type UserDelete = RequestHandler<{ id: string }, undefined | errorResponse>;
export type UserGetById = RequestHandler<{ id: string }, WithId<User> | errorResponse>;
export type UserGetByEmail = RequestHandler<{ email: string }, WithId<User> | errorResponse>;

export const updateUser: UserUpdate = async (req, res) => {
  try {
    const user: PartialUserUpdate = req.body;

    UserSchema.partial().parse(user);

    const result = await service.updateUser(user);
    console.log(result);
    if (result.matchedCount === 0) {
      return res.status(httpCode.NOT_FOUND).json({ message: 'User not found' });
    }
    return res.status(httpCode.NO_CONTENT).send();
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body as User & { password: string };

    UserSchema.parse(user);

    const result = await service.createUser(user);
    return res.json(result);
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await service.deleteUser(id);
    return res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

import { User, UserMongoDB, UserRegister, UserRegisterSchema, UserSchema } from '../models/user.model';
import * as service from '../services/user.service';
import { ZodError } from 'zod';
import httpCode from 'http-status-codes';
import { RequestHandler } from 'express';
import { ErrorResponse } from '../Globals';
import { ObjectId, WithId } from 'mongodb';

export type PartialUserUpdate = { _id: string } & Partial<User>;
export type UserUpdate = RequestHandler<PartialUserUpdate, undefined | ErrorResponse>;
export type UserCreate = RequestHandler<UserRegister, { _id: string | ObjectId } | ErrorResponse>;
export type UserDelete = RequestHandler<{ id: string }, undefined | ErrorResponse>;
export type UserGetById = RequestHandler<{ id: string }, WithId<UserMongoDB> | ErrorResponse>;
export type UserGetByEmail = RequestHandler<{ email: string }, WithId<UserMongoDB> | ErrorResponse>;

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

export const createUser: UserCreate = async (req, res) => {
  try {
    const user = req.body as UserRegister;

    UserRegisterSchema.parse(user);

    const result = await service.createUser(user);
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

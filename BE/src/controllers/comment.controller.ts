import { RequestHandler } from 'express';
import { Comment, CommentSchema } from '../models/comment.model';
import * as service from '../services/comment.service';
import { ZodError } from 'zod';
import httpCode from 'http-status-codes';
import { ErrorResponse } from '../Globals';
import { ObjectId, WithId } from 'mongodb';

export type PartialCommentUpdate = { _id: string } & Partial<Comment>;
export type CommentCreate = RequestHandler<Comment, string | ObjectId | ErrorResponse>;
export type CommentDelete = RequestHandler<{ id: string }, undefined | ErrorResponse>;
export type CommentGetById = RequestHandler<{ id: string }, WithId<Comment> | ErrorResponse>;

export const updateComment: RequestHandler<PartialCommentUpdate, undefined | ErrorResponse> = async (req, res) => {
  try {
    const comment: PartialCommentUpdate = req.body;

    CommentSchema.partial().parse(comment);

    const result = await service.updateComment(comment);
    if (result.matchedCount === 0) {
      return res.status(httpCode.NOT_FOUND).json({ message: 'Comment not found' });
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

export const getCommentById: CommentGetById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await service.readComment(id);
    if (!result) {
      return res.status(httpCode.NOT_FOUND).json({ message: 'Comment not found' });
    }
    return res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const createComment: CommentCreate = async (req, res) => {
  try {
    const comment = req.body as Comment;

    CommentSchema.parse(comment);

    const result = await service.createComment(comment);
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

export const deleteComment: CommentDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await service.deleteComment(id);
    return res.status(httpCode.NO_CONTENT).send();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(httpCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

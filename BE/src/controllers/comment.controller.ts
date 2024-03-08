/* eslint-disable @typescript-eslint/no-misused-promises */
import {RequestHandler} from 'express';
import {ZodError} from 'zod';
import httpCode from 'http-status-codes';
import {ObjectId, WithId} from 'mongodb';
import {Comment, CommentMongoDb, CommentSchema} from '../models/comment.model';
import * as service from '../services/comment.service';
import {ErrorResponse} from '../Globals';
import {CommentCreateResponse} from "../types/commentRequest.type";

export type PartialCommentUpdate = WithId<Partial<CommentMongoDb>>;
export type CommentUpdate = RequestHandler<{}, CommentCreateResponse>
export type CommentCreate = RequestHandler<{}, CommentCreateResponse>
export type CommentDelete = RequestHandler<{ id: string }, undefined | ErrorResponse>;
export type CommentGetById = RequestHandler<{ id: string }, WithId<CommentMongoDb> | ErrorResponse>;
export type CommentGetByMovieId = RequestHandler<{ movieId: string }, WithId<CommentMongoDb>[] | ErrorResponse>;
export type CommentGetByUserId = RequestHandler<{ userId: string }, WithId<CommentMongoDb>[] | ErrorResponse>;
export type CommentGetThread = RequestHandler<{ mainCommentId: string }, WithId<CommentMongoDb>[] | ErrorResponse>;


export const updateComment: CommentUpdate = async (req, res) => {
    try {
        //@ts-ignore
        const userId: string = req.userId;
        const comment: PartialCommentUpdate = req.body;

        const image = req.file;

        if (image) {
            comment.imagePath = image.path;
        } else {
            comment.imagePath = undefined;
        }

        comment.rating = parseInt(String(comment.rating), 10)

        const {_id: _, ...commentToParse} = comment;

        CommentSchema.partial().parse(commentToParse);

        const result = await service.updateComment(comment, userId);
        if (result.modifiedCount === 1 && comment.imagePath) {
            return res.json({_id: comment._id, imagePath: comment.imagePath});
        } else if (result.modifiedCount === 1) {
            return res.json({_id: comment._id});
        } else {
            return res.status(httpCode.NOT_FOUND).json({message: 'Comment not found'});
        }

    } catch (err: unknown) {
        if (err instanceof ZodError) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.issues});
        }
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

export const getCommentById: CommentGetById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await service.readComment(id);
        if (!result) {
            return res.status(httpCode.NOT_FOUND).json({message: 'Comment not found'});
        }
        return res.json(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

export const getCommentsByMovieId: CommentGetByMovieId = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const result = await service.getCommentsByMovieId(parseFloat(movieId));
        return res.json(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

export const getCommentsByUserId: CommentGetByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await service.getCommentsByUserId(userId);
        return res.json(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

export const getCommentsThread: CommentGetThread = async (req, res) => {
    try {
        const mainCommentId = req.params.mainCommentId;
        const result = await service.getCommentsThread(mainCommentId);
        return res.json(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

export const createComment: CommentCreate = async (req, res) => {
    try {
        const comment = req.body as Comment;
        const image = req.file;

        if (image) {
            comment.imagePath = image.path;
        }
        //@ts-ignore
        if (comment.userId !== req.userId) {
            return res.status(httpCode.FORBIDDEN).json({message: 'User cannot preform actions on behalf of someone else.'});
        }

        comment.movieId = parseInt(String(comment.movieId), 10)
        comment.rating = parseInt(String(comment.rating), 10)

        CommentSchema.parse(comment);

        const result = await service.createComment(comment);
        return res.json({_id: result, imagePath: comment.imagePath});
    } catch (err: unknown) {
        if (err instanceof ZodError) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.issues});
        }
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

export const deleteComment: CommentDelete = async (req, res) => {
    try {
        const id = req.params.id;
        //@ts-ignore
        const userId = req.userId as string;
        const result = await service.deleteComment(id, userId);
        if (result.deletedCount === 0) {
            return res.status(httpCode.NOT_FOUND).json({message: 'Comment not found'});
        }
        return res.status(httpCode.NO_CONTENT).send();
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(httpCode.BAD_REQUEST).json({message: err.message});
        }
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'});
    }
};

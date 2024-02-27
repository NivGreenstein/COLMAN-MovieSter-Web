import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const CommentSchema = z
  .object({
    movieId: z.number(),
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId)),
    mainCommentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId))
      .optional(),
    description: z.string(),
    rating: z.number().min(0).max(10),
  })
  .strict();

export type Comment = z.infer<typeof CommentSchema>;

export const CommentMongoDbSchema = CommentSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
}).strict();

export type CommentMongoDb = z.infer<typeof CommentMongoDbSchema>;

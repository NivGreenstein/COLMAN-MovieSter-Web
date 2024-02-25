import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const CommentSchema = z
  .object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId))
      .optional(),
    movieId: z.number(),
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId)),
    description: z.string().url(),
    rating: z.number().min(0).max(10),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict();

export type Comment = z.infer<typeof CommentSchema>;

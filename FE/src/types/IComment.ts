// export interface IUserComment {
//     movieTitle: string;
//     rating: number;
//     text: string;
//     date: string | Date;
// }

// export interface IMovieComment {
//     username: string;
//     rating: number;
//     text: string;
//     date: string | Date;
// }

// export type Comment = IUserComment | IMovieComment;

import { z } from 'zod';

export const CommentSchema = z
  .object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    movieId: z.number(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    mainCommentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    description: z.string(),
    rating: z.number().min(0).max(5),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Comment = z.infer<typeof CommentSchema>;

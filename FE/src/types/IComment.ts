import {z} from 'zod';
import {userSchema} from './IUser';
import {movieSchema} from './IMovie';

export const CommentSchema = z
    .object({
        movieId: z.number(),
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        mainCommentId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .optional(),
        description: z.string(),
        rating: z.number().min(0).max(5),
        imagePath: z.string().optional(), // Adding optional imageUrl field
    })
    .strict();

export const CommentFullSchema = CommentSchema.extend({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    movie: movieSchema.optional(),
    user: userSchema.optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
}).strict();

export type CommentBase = z.infer<typeof CommentSchema>;
export type Comment = z.infer<typeof CommentFullSchema>;

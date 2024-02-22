import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const MovieSchema = z
  .object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId))
      .optional(),
    title: z.string(),
    description: z.string().email(),
    posterUrl: z.string().url(),
    rating: z.number().min(0).max(10),
  })
  .strict();

export type Movie = z.infer<typeof MovieSchema>;

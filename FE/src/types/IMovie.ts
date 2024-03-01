import { z } from 'zod';

export const movieSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    posterUrl: z.string().url(),
    rating: z.number().min(0).max(10),
  })
  .strict();

export type IMovie = z.infer<typeof movieSchema>;

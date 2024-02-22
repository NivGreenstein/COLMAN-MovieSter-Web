import { z } from 'zod';

export const MovieSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string().email(),
    posterUrl: z.string().url(),
    rating: z.number().min(0).max(10),
  })
  .strict();

export type Movie = z.infer<typeof MovieSchema>;

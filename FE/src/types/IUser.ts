import { z } from 'zod';

export const userSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    profilePictureUrl: z.string().url(),
    password: z.string().min(8).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type IUser = z.infer<typeof userSchema>;

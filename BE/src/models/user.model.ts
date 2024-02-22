import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z
  .object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId))
      .optional(),
    username: z.string(),
    email: z.string().email(),
    profilePicture: z.string().url(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;

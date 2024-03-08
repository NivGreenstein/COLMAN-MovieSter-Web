import { z } from 'zod';

export const baseUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  profilePictureUrl: z.string().url(),
  password: z.string().min(8).optional(),
  isGoogleUser: z.boolean().default(false).optional(),
});

export const userSchema = baseUserSchema
  .extend({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type IUser = z.infer<typeof userSchema>;
export type IBaseUser = z.infer<typeof baseUserSchema>;

import { z } from 'zod';

export const userSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    profilePictureUrl: z.string().url(),
    isGoogleUser: z.boolean().default(false).optional(),
  })
  .strict();

export type User = z.infer<typeof userSchema>;

export const userRegisterSchema = userSchema.extend({
  password: z.string().min(8),
});

export type UserRegister = z.infer<typeof userRegisterSchema>;

export const userMongoDBSchema = userSchema.extend({
  password: z.string().min(8).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserMongoDB = z.infer<typeof userMongoDBSchema>;

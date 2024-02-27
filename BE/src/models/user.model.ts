import { z } from 'zod';

export const UserSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    profilePictureUrl: z.string().url(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;

export const UserRegisterSchema = UserSchema.extend({
  password: z.string().min(8),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;

export const UserMongoDBSchema = UserSchema.extend({
  password: z.string().min(8).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserMongoDB = z.infer<typeof UserMongoDBSchema>;

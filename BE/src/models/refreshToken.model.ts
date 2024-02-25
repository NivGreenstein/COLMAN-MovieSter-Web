import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const RefreshTokenSchema = z
  .object({
    _id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId))
      .optional(),
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .or(z.instanceof(ObjectId)),
    token: z.string().uuid(),
    revoked: z.boolean().default(false),
    createdAt: z.date(),
    expiresAt: z.date(),
  })
  .strict();

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

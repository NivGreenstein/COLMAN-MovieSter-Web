import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z.object({
	_id: z.string().optional(),
	username: z.string(),
	email: z.string().email(),
	profilePicture: z.string().url().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

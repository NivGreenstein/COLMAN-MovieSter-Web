import { Request, Response } from 'express';
import { User } from '../models/user.model';
import * as service from '../services/user.service';
import { ZodError } from 'zod';

export const updateUser = async (req: Request, res: Response) => {
	try {
		const user = req.body as User;
		const result = await service.updateUser(user);
		return res.json(result);
	} catch (err: unknown) {
		if (err instanceof ZodError) {
			return res.status(400).json({ message: err.issues });
		}
		if (err instanceof Error) {
			return res.status(400).json({ message: err.message });
		}
		return res.status(500).json({ message: 'Internal server error' });
	}
};

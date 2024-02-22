import { Request, Response } from 'express';
import { User, UserSchema } from '../models/user.model';
import * as service from '../services/authentication.service';
import { ZodError } from 'zod';
export const register = async (req: Request, res: Response) => {
	try {
		const user = req.body as User;
		const password = req.body.password as string;
		const result = await service.register(user, password);
		return res.status(201).json(result);
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

export const login = async (req: Request, res: Response) => {
	try {
		const username = req.body.username as string;
		const password = req.body.password as string;
		const result = await service.login(username, password);
		return res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return res.status(400).json({ message: err.message });
		}
		return res.status(500).json({ message: 'Internal server error' });
	}
};

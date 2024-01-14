import { Request, Response } from 'express';
import * as service from '../services/helloWorld.service';

export const helloWorld = async (req: Request, res: Response) => {
	const message = service.helloWorld();
	res.send(message);
};

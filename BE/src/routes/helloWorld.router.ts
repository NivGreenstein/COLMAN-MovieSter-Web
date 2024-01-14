import { Router } from 'express';
import { helloWorld } from '../controllers/helloWorld.controller';

const router = Router();

router.post('/', helloWorld);

export default router;

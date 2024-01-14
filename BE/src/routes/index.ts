import { Router } from 'express';
import helloWorldRouter from './helloWorld.router';

const router = Router();
router.use(helloWorldRouter);

export default router;

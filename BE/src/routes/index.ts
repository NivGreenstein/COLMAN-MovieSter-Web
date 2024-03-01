import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import authenticatedRouter from './authenticated.router';
import unauthenticatedRouter from './unauthenticated.router';

const router = Router();

router.use(unauthenticatedRouter);
router.use(authMiddleware, authenticatedRouter);

export default router;

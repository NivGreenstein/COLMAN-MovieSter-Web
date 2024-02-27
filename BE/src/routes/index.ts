import { Router } from 'express';
import authenticatedRouter from './authenticated.router';
import unauthenticatedRouter from './unauthenticated.router';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(unauthenticatedRouter);
router.use(authMiddleware, authenticatedRouter);

export default router;

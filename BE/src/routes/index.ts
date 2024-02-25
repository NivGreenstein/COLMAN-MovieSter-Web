import { Router } from 'express';
import userRouter from './user.router';
import movieRouter from './movie.router';
import commentRouter from './comment.router';
import { register, login, logout, generateAccessToken } from '../controllers/authentication.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

//from this line, all routes are protected
router.use(authMiddleware);

router.post('/logout', logout);
router.post('/token', generateAccessToken);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('/comments', commentRouter);

export default router;

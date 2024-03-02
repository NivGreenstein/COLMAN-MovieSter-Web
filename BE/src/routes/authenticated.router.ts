import { Router } from 'express';
import { logout } from '../controllers/authentication.controller';
import userRouter from './user.router';
import movieRouter from './movie.router';
import commentRouter from './comment.router';

const router = Router();

router.post('/logout', logout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('/comments', commentRouter);

export default router;

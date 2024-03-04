import { Router } from 'express';
import {
  updateComment,
  getCommentById,
  createComment,
  deleteComment,
  getCommentsByMovieId,
  getCommentsByUserId,
  getCommentsThread,
} from '../controllers/comment.controller';

const router = Router();

router.post('/', createComment);
router.patch('/', updateComment);
router.get('/:id', getCommentById);
router.delete('/:id', deleteComment);
router.get('/movie/:movieId', getCommentsByMovieId);
router.get('/user/:userId', getCommentsByUserId);
router.get('/thread/:mainCommentId', getCommentsThread);

export default router;

import { Router } from 'express';
import {
  updateComment,
  getCommentById,
  createComment,
  deleteComment,
  getCommentsByMovieId,
  getCommentsByUserId,
} from '../controllers/comment.controller';
import {upload} from "../middlewares/imageUploader.middleware";

const router = Router();

router.post('/', upload.single('image'), createComment);
router.patch('/', updateComment);
router.get('/:id', getCommentById);
router.delete('/:id', deleteComment);
router.get('/movie/:movieId', getCommentsByMovieId);
router.get('/user/:userId', getCommentsByUserId);

export default router;

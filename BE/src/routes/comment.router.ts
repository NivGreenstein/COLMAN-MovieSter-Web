import { Router } from 'express';
import { updateComment, getCommentById, createComment, deleteComment } from '../controllers/comment.controller';
const router = Router();

router.post('/', createComment);
router.get('/:id', getCommentById);
router.put('/', updateComment);
router.delete('/:id', deleteComment);

export default router;

import { Router } from 'express';
import { updateUser, getUserById, getUserByEmail, getCurrentUser } from '../controllers/user.controller';

const router = Router();

router.get('/me', getCurrentUser);
router.get('/email/:email', getUserByEmail);
router.get('/:id', getUserById);
router.patch('/', updateUser);

export default router;

import { Router } from 'express';
import { updateUser, getUserById } from '../controllers/user.controller';
const router = Router();

router.get('/:id', getUserById);
router.patch('/', updateUser);

export default router;

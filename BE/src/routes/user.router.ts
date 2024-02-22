import { Router } from 'express';
import { updateUser, getUserById, getUserByEmail, deleteUser, createUser } from '../controllers/user.controller';
const router = Router();

router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.put('/', updateUser);
router.delete('/:id', deleteUser);

export default router;

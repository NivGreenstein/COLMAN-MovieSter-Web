import { Router } from 'express';
import { updateUser, getUserById, getUserByEmail, getCurrentUser } from '../controllers/user.controller';
import {upload} from "../middlewares/imageUploader.middleware";

const router = Router();

router.get('/me', getCurrentUser);
router.get('/email/:email', getUserByEmail);
router.get('/:id', getUserById);
router.patch('/',  upload.none(), updateUser);

export default router;

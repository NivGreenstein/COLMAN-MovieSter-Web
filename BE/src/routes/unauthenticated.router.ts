import { Router } from 'express';
import { register, login, generateAccessToken } from '../controllers/authentication.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/token', generateAccessToken);

export default router;

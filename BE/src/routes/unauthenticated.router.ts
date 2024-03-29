import { Router } from 'express';
import { register, login, generateAccessToken, googleLogin } from '../controllers/authentication.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login/google', googleLogin);
router.get('/token', generateAccessToken);

export default router;

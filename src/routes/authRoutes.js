import express from 'express';
import { login, register, refreshToken, logout } from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);

export default router;
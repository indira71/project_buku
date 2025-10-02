import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Admin routes for managing users
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
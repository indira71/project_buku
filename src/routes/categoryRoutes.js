import express from 'express';
import { 
  getCategories, 
  getCategory, 
  addCategory, 
  editCategory, 
  removeCategory 
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes
router.post('/', authenticateToken, addCategory);
router.put('/:id', authenticateToken, editCategory);
router.delete('/:id', authenticateToken, removeCategory);

export default router;
import express from 'express';
import { 
  getStatuses, 
  getStatus, 
  addStatus, 
  editStatus, 
  removeStatus 
} from '../controllers/statusController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getStatuses);
router.get('/:id', getStatus);

// Protected routes
router.post('/', authenticateToken, addStatus);
router.put('/:id', authenticateToken, editStatus);
router.delete('/:id', authenticateToken, removeStatus);

export default router;
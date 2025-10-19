import express from 'express';
import {
  getSubjeks,
  getSubjek,
  addSubjek,
  editSubjek,
  removeSubjek
} from '../controllers/subjekController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (jika diperlukan)
router.get('/', getSubjeks);
router.get('/:id', getSubjek);

// Protected routes (butuh authentication)
router.post('/', authenticateToken, addSubjek);
router.put('/:id', authenticateToken, editSubjek);
router.delete('/:id', authenticateToken, removeSubjek);

export default router;
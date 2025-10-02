import express from 'express';
import { 
  getExemplars, 
  getExemplar, 
  addExemplar, 
  editExemplar, 
  removeExemplar,
  getExemplarsByBooks,
  getAvailableExemplarsByBook,
  updateExemplarStatusOnly,
  getExemplarStats,
  getExemplarByInduk
} from '../controllers/exemplarController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/stats', getExemplarStats);
router.get('/book/:bookId', getExemplarsByBooks);
router.get('/book/:bookId/available', getAvailableExemplarsByBook);
router.get('/nomor/:nomorInduk', getExemplarByInduk);
router.get('/:id', getExemplar);
router.get('/', getExemplars);

// Protected routes
router.post('/', authenticateToken, addExemplar);
router.put('/:id', authenticateToken, editExemplar);
router.put('/:id/status', authenticateToken, updateExemplarStatusOnly);
router.delete('/:id', authenticateToken, removeExemplar);

export default router;
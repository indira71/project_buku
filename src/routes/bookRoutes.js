import express from 'express';
import { 
  getBooks, 
  getBook, 
  addBook, 
  editBook, 
  removeBook,
  getBooksByCategories 
} from '../controllers/bookController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);
router.get('/category/:categoryId', getBooksByCategories);

// Protected routes
router.post('/', authenticateToken, addBook);
router.put('/:id', authenticateToken, editBook);
router.delete('/:id', authenticateToken, removeBook);

export default router;
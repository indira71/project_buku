import express from 'express';
import { 
  borrowBook, 
  getUserLendings, 
  getLendings, 
  getLending,
  returnBook,
  getOverdueBooks, 
  borrowBookWithExemplar,
  returnBookWithExemplar
} from '../controllers/lendingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All lending routes require authentication
router.use(authenticateToken);

router.post('/borrow', borrowBook);
router.get('/my-lendings', getUserLendings);
router.get('/overdue', getOverdueBooks);
router.get('/', getLendings);
router.get('/:id', getLending);
router.put('/:id/return', returnBook);
router.post('/borrow-exemplar', borrowBookWithExemplar);
router.put('/:id/return-exemplar', returnBookWithExemplar);

export default router;
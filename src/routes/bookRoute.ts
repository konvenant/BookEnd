import express from 'express';
import multer from 'multer';
import {
  createBook,
  updateBookCover,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Create a new book
router.post('/books', createBook);

// Update book cover picture
router.patch('/books/cover-image/:id', upload.single('coverImage'), updateBookCover);

// Get all books
router.get('/books', getAllBooks);

// Get a single book by ID
router.get('/books/:id', getBookById);

// Update a book by ID
router.put('/books/:id', updateBook);

// Delete a book by ID
router.delete('/books/:id', deleteBook);

export default router;

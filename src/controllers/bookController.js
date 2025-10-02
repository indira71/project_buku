import { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook,
  getBooksByCategory 
} from '../models/bookModel.js';

export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const books = await getAllBooks(parseInt(limit), offset, search);
    
    res.json({
      message: 'Data buku berhasil diambil',
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    res.json({
      message: 'Data buku berhasil diambil',
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const addBook = async (req, res) => {
  try {
    const bookData = req.body;
    
    // Validasi input dasar
    if (!bookData.judul || !bookData.penerbit) {
      return res.status(400).json({ message: 'Judul dan penerbit wajib diisi' });
    }
    
    const newBook = await createBook(bookData);
    
    res.status(201).json({
      message: 'Buku berhasil ditambahkan',
      data: newBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body;
    
    const existingBook = await getBookById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    const updated = await updateBook(id, bookData);
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui buku' });
    }
    
    res.json({
      message: 'Buku berhasil diperbarui',
      data: { id, ...bookData }
    });
  } catch (error) {
    console.error('Edit book error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const removeBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingBook = await getBookById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    const deleted = await deleteBook(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Gagal menghapus buku' });
    }
    
    res.json({ message: 'Buku berhasil dihapus' });
  } catch (error) {
    console.error('Remove book error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getBooksByCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const books = await getBooksByCategory(categoryId);
    
    res.json({
      message: 'Data buku berhasil diambil',
      data: books
    });
  } catch (error) {
    console.error('Get books by category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
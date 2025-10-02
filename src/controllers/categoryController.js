import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../models/categoryModel.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    
    res.json({
      message: 'Data kategori berhasil diambil',
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    res.json({
      message: 'Data kategori berhasil diambil',
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { nama } = req.body;
    
    if (!nama) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi' });
    }
    
    const newCategory = await createCategory({ nama });
    
    res.status(201).json({
      message: 'Kategori berhasil ditambahkan',
      data: newCategory
    });
  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    
    if (!nama) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi' });
    }
    
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    const updated = await updateCategory(id, { nama });
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui kategori' });
    }
    
    res.json({
      message: 'Kategori berhasil diperbarui',
      data: { id, nama }
    });
  } catch (error) {
    console.error('Edit category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Gagal menghapus kategori' });
    }
    
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Remove category error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
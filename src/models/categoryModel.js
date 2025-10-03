import pool from '../config/database.js';

export const getAllCategories = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM kategori WHERE is_deleted = 0 ORDER BY nama ASC'
    );
    return rows;
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM kategori WHERE id = ? AND is_deleted = 0',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting category by id:', error);
    throw error;
  }
};

// Helper function untuk generate ID kategori
const generateCategoryId = async () => {
  try {
    // Ambil ID terakhir
    const [rows] = await pool.execute(
      "SELECT id FROM kategori WHERE id LIKE 'KT%' ORDER BY id DESC LIMIT 1"
    );
    
    if (rows.length === 0) {
      return 'KT01'; // ID pertama jika belum ada data
    }
    
    // Extract nomor dari ID terakhir (misal: KT04 -> 4)
    const lastId = rows[0].id;
    const lastNumber = parseInt(lastId.substring(2));
    const newNumber = lastNumber + 1;
    
    // Format dengan leading zero (KT05, KT06, dst)
    return `KT${newNumber.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error generating category ID:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  const { nama } = categoryData;
  
  try {
    // Generate ID otomatis
    const newId = await generateCategoryId();
    
    await pool.execute(
      'INSERT INTO kategori (id, nama, created_at, created_by) VALUES (?, ?, NOW(), ?)',
      [newId, nama, 'system']
    );
    
    return { id: newId, nama };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  const { nama } = categoryData;
  
  try {
    const [result] = await pool.execute(
      'UPDATE kategori SET nama = ?, updated_at = NOW(), updated_by = ? WHERE id = ? AND is_deleted = 0',
      [nama, 'system', id]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const [result] = await pool.execute(
      'UPDATE kategori SET is_deleted = 1, updated_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
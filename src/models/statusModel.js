import pool from '../config/database.js';

export const getAllStatuses = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM status WHERE is_deleted = 0 ORDER BY nama ASC'
    );
    return rows;
  } catch (error) {
    console.error('Error getting all statuses:', error);
    throw error;
  }
};

export const getStatusById = async (id) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM status WHERE id = ? AND is_deleted = 0',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting status by id:', error);
    throw error;
  }
};

// Helper function untuk generate ID status
const generateStatusId = async () => {
  try {
    const [rows] = await pool.execute(
      "SELECT id FROM status WHERE id LIKE 'ST%' ORDER BY id DESC LIMIT 1"
    );
    
    if (rows.length === 0) {
      return 'ST01';
    }
    
    const lastId = rows[0].id;
    const lastNumber = parseInt(lastId.substring(2));
    const newNumber = lastNumber + 1;
    
    return `ST${newNumber.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error generating status ID:', error);
    throw error;
  }
};

export const createStatus = async (statusData) => {
  const { nama } = statusData;
  
  try {
    const newId = await generateStatusId();
    
    await pool.execute(
      'INSERT INTO status (id, nama, created_at, created_by) VALUES (?, ?, NOW(), ?)',
      [newId, nama, 'system']
    );
    
    return { id: newId, nama };
  } catch (error) {
    console.error('Error creating status:', error);
    throw error;
  }
};

export const updateStatus = async (id, statusData) => {
  const { nama } = statusData;
  
  try {
    const [result] = await pool.execute(
      'UPDATE status SET nama = ?, updated_at = NOW(), updated_by = ? WHERE id = ? AND is_deleted = 0',
      [nama, 'system', id]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export const deleteStatus = async (id) => {
  try {
    const [result] = await pool.execute(
      'UPDATE status SET is_deleted = 1, updated_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting status:', error);
    throw error;
  }
};
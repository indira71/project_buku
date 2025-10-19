import db from '../config/database.js';

export const getAllSubjeks = async () => {
  const query = `
    SELECT * FROM subjek 
    WHERE is_deleted = 0
    ORDER BY id ASC
  `;
  
  const [rows] = await db.execute(query);
  return rows;
};

export const getSubjekById = async (id) => {
  const query = `
    SELECT * FROM subjek 
    WHERE id = ? AND is_deleted = 0
  `;
  
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};

export const createSubjek = async (subjekData) => {
  const { id, nama } = subjekData;

  const query = `
    INSERT INTO subjek (id, nama, created_at, created_by)
    VALUES (?, ?, NOW(), ?)
  `;

  await db.execute(query, [id, nama, 'system']);

  return { id, nama };
};

export const updateSubjek = async (id, subjekData) => {
  const { nama } = subjekData;

  const query = `
    UPDATE subjek 
    SET nama = ?, 
        updated_at = NOW(), 
        updated_by = ?
    WHERE id = ? AND is_deleted = 0
  `;

  const [result] = await db.execute(query, [nama, 'system', id]);
  return result.affectedRows > 0;
};

export const deleteSubjek = async (id) => {
  // Soft delete
  const query = `
    UPDATE subjek 
    SET is_deleted = 1, 
        updated_at = NOW(), 
        updated_by = ? 
    WHERE id = ?
  `;

  const [result] = await db.execute(query, ['system', id]);
  return result.affectedRows > 0;
};
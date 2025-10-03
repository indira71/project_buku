import pool from '../config/database.js';
import { v4 as uuidv4 } from "uuid";

export const getAllExemplars = async (limit = 10, offset = 0, search = "", bookId = null) => {
  try {
    let query = `
      SELECT e.*, b.judul as buku_judul, s.nama as status_nama
      FROM eksemplar e
      LEFT JOIN buku b ON e.buku_id = b.id
      LEFT JOIN status s ON e.status = s.id
      WHERE e.is_deleted = 0
    `;
    let params = [];

    if (search) {
      query += ` AND (e.nomor_induk LIKE ? OR b.judul LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (bookId) {
      query += ` AND e.buku_id = ?`;
      params.push(bookId);
    }

    const offsetInt = parseInt(offset) || 0;
    const limitInt = parseInt(limit) || 10;

    // Sama kayak getAllBooks → limit langsung diinject ke query, bukan pakai `?`
    query += ` ORDER BY e.created_at DESC LIMIT ${offsetInt}, ${limitInt}`;

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error getting all exemplars:", error);
    throw error;
  }
};

export const getExemplarById = async (id) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, b.judul as buku_judul, s.nama as status_nama 
      FROM eksemplar e 
      LEFT JOIN buku b ON e.buku_id = b.id 
      LEFT JOIN status s ON e.status = s.id
      WHERE e.id = ? AND e.is_deleted = 0
    `, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting exemplar by id:', error);
    throw error;
  }
};

export const getExemplarByNomorInduk = async (nomorInduk) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, b.judul as buku_judul, s.nama as status_nama 
      FROM eksemplar e 
      LEFT JOIN buku b ON e.buku_id = b.id 
      LEFT JOIN status s ON e.status = s.id
      WHERE e.nomor_induk = ? AND e.is_deleted = 0
    `, [nomorInduk]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting exemplar by nomor induk:', error);
    throw error;
  }
};

export const createExemplar = async (exemplarData) => {
  const { nomor_induk, status, opac, buku_id } = exemplarData;
  
  try {
    const existing = await getExemplarByNomorInduk(nomor_induk);
    if (existing) {
      throw new Error('Nomor induk sudah ada');
    }

    const id = uuidv4();

    const [result] = await pool.execute(`
      INSERT INTO eksemplar 
      (id, nomor_induk, status, opac, buku_id, created_at, created_by) 
      VALUES (?, ?, ?, ?, ?, NOW(), ?)
    `, [id, nomor_induk, status, opac, buku_id, 'system']);

    return { id: result.insertId, ...exemplarData };
  } catch (error) {
    console.error('Error creating exemplar:', error);
    throw error;
  }
};

export const updateExemplar = async (id, exemplarData) => {
  const { nomor_induk, status, opac, buku_id } = exemplarData;
  
  try {
    // Check if nomor_induk already exists for other exemplars
    if (nomor_induk) {
      const existing = await getExemplarByNomorInduk(nomor_induk);
      if (existing && existing.id !== id) {
        throw new Error('Nomor induk sudah ada');
      }
    }

    const [result] = await pool.execute(`
      UPDATE eksemplar SET 
      nomor_induk = ?, status = ?, opac = ?, buku_id = ?, 
      updated_at = NOW(), updated_by = ?
      WHERE id = ? AND is_deleted = 0
    `, [nomor_induk, status, opac, buku_id, 'system', id]);
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating exemplar:', error);
    throw error;
  }
};

export const deleteExemplar = async (id) => {
  try {
    const [result] = await pool.execute(
      'UPDATE eksemplar SET is_deleted = 1, updated_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting exemplar:', error);
    throw error;
  }
};

export const getExemplarsByBook = async (bookId) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, s.nama as status_nama 
      FROM eksemplar e 
      LEFT JOIN status s ON e.status = s.id
      WHERE e.buku_id = ? AND e.is_deleted = 0
      ORDER BY e.nomor_induk ASC
    `, [bookId]);
    return rows;
  } catch (error) {
    console.error('Error getting exemplars by book:', error);
    throw error;
  }
};

export const getAvailableExemplars = async (bookId) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, s.nama as status_nama 
      FROM eksemplar e 
      LEFT JOIN status s ON e.status = s.id
      WHERE e.buku_id = ? AND e.status = '1' AND e.is_deleted = 0
      ORDER BY e.nomor_induk ASC
    `, [bookId]);
    return rows;
  } catch (error) {
    console.error('Error getting available exemplars:', error);
    throw error;
  }
};

export const updateExemplarStatus = async (id, status) => {
  try {
    const [result] = await pool.execute(
      'UPDATE eksemplar SET status = ?, updated_at = NOW(), updated_by = ? WHERE id = ? AND is_deleted = 0',
      [status, 'system', id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating exemplar status:', error);
    throw error;
  }
};

export const getExemplarCount = async (bookId = null, status = null) => {
  try {
    let query = 'SELECT COUNT(*) as total FROM eksemplar WHERE is_deleted = 0';
    let params = [];

    if (bookId) {
      query += ' AND buku_id = ?';
      params.push(bookId);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  } catch (error) {
    console.error('Error getting exemplar count:', error);
    throw error;
  }
};
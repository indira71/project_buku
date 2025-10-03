import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

export const createLending = async (lendingData) => {
  const {
    tanggal_pinjam,
    tenggat_kembali,
    keterangan,
    status_id,
    buku_id,
    pengguna_id,
  } = lendingData;

  const id = uuidv4();

  try {
    const [result] = await pool.execute(
      `
      INSERT INTO peminjaman 
      (id, tanggal_pinjam, tenggat_kembali, keterangan, status_id, buku_id, pengguna_id, created_at, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `,
      [
        id,
        tanggal_pinjam,
        tenggat_kembali,
        keterangan,
        status_id,
        buku_id,
        pengguna_id,
        "system",
      ]
    );

    return { id: result.insertId, ...lendingData };
  } catch (error) {
    console.error("Error creating lending:", error);
    throw error;
  }
};

export const getLendingsByUser = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT p.*, b.judul as buku_judul, s.nama as status_nama,
             u.nama as pengguna_nama
      FROM peminjaman p 
      LEFT JOIN buku b ON p.buku_id = b.id 
      LEFT JOIN status s ON p.status_id = s.id 
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      WHERE p.pengguna_id = ? AND p.is_deleted = 0
      ORDER BY p.created_at DESC
    `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error getting lendings by user:", error);
    throw error;
  }
};

export const getAllLendings = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT p.*, b.judul as buku_judul, s.nama as status_nama,
             u.nama as pengguna_nama
      FROM peminjaman p 
      LEFT JOIN buku b ON p.buku_id = b.id 
      LEFT JOIN status s ON p.status_id = s.id 
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      WHERE p.is_deleted = 0
    `;
    let params = [];

    // kalau mau pencarian (misalnya cari judul buku / nama pengguna)
    if (search) {
      query += ` AND (b.judul LIKE ? OR u.nama LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const offsetInt = parseInt(offset) || 0;
    const limitInt = parseInt(limit) || 10;

    query += ` ORDER BY p.created_at DESC LIMIT ${offsetInt}, ${limitInt}`;

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error getting all lendings:", error);
    throw error;
  }
};


export const getLendingById = async (id) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT p.*, b.judul as buku_judul, s.nama as status_nama,
             u.nama as pengguna_nama, u.email as pengguna_email
      FROM peminjaman p 
      LEFT JOIN buku b ON p.buku_id = b.id 
      LEFT JOIN status s ON p.status_id = s.id 
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      WHERE p.id = ? AND p.is_deleted = 0
    `,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting lending by id:", error);
    throw error;
  }
};

export const updateLendingStatus = async (
  id,
  statusId,
  tanggalKembali = null
) => {
  try {
    let query = "UPDATE peminjaman SET status_id = ?, updated_at = NOW()";
    let params = [statusId];

    if (tanggalKembali) {
      query += ", tanggal_kembali = ?";
      params.push(tanggalKembali);
    }

    query += " WHERE id = ? AND is_deleted = 0";
    params.push(id);

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating lending status:", error);
    throw error;
  }
};

export const getOverdueLendings = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, b.judul as buku_judul, u.nama as pengguna_nama, u.email as pengguna_email
      FROM peminjaman p 
      LEFT JOIN buku b ON p.buku_id = b.id 
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      WHERE p.tenggat_kembali < NOW() 
      AND p.tanggal_kembali IS NULL 
      AND p.is_deleted = 0
      ORDER BY p.tenggat_kembali ASC
    `);
    return rows;
  } catch (error) {
    console.error("Error getting overdue lendings:", error);
    throw error;
  }
};

export const createLendingWithExemplar = async (lendingData) => {
  const { tanggal_pinjam, tenggat_kembali, keterangan, status_id, buku_id, pengguna_id, eksemplar_id } = lendingData;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert peminjaman
    const [result] = await connection.execute(`
      INSERT INTO peminjaman 
      (tanggal_pinjam, tenggat_kembali, keterangan, status_id, buku_id, pengguna_id, eksemplar_id, created_at, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `, [tanggal_pinjam, tenggat_kembali, keterangan, status_id, buku_id, pengguna_id, eksemplar_id, 'system']);
    
    // Update status eksemplar menjadi dipinjam
    await connection.execute(`
      UPDATE eksemplar SET status = '2', updated_at = NOW(), updated_by = 'system' 
      WHERE id = ?
    `, [eksemplar_id]);
    
    await connection.commit();
    
    return { id: result.insertId, ...lendingData };
  } catch (error) {
    await connection.rollback();
    console.error('Error creating lending with exemplar:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const returnLendingWithExemplar = async (lendingId, tanggalKembali) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get lending data
    const [lendingRows] = await connection.execute(`
      SELECT * FROM peminjaman WHERE id = ? AND is_deleted = 0
    `, [lendingId]);
    
    if (lendingRows.length === 0) {
      throw new Error('Peminjaman tidak ditemukan');
    }
    
    const lending = lendingRows[0];
    
    // Update peminjaman status to returned
    await connection.execute(`
      UPDATE peminjaman 
      SET status_id = '3', tanggal_kembali = ?, updated_at = NOW(), updated_by = 'system'
      WHERE id = ?
    `, [tanggalKembali, lendingId]);
    
    // Update eksemplar status to available
    if (lending.eksemplar_id) {
      await connection.execute(`
        UPDATE eksemplar SET status = '1', updated_at = NOW(), updated_by = 'system' 
        WHERE id = ?
      `, [lending.eksemplar_id]);
    }
    
    await connection.commit();
    
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error returning lending with exemplar:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const getLendingsWithExemplar = async (limit = 10, offset = 0) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, b.judul as buku_judul, s.nama as status_nama,
             u.nama as pengguna_nama, e.nomor_induk as eksemplar_nomor
      FROM peminjaman p 
      LEFT JOIN buku b ON p.buku_id = b.id 
      LEFT JOIN status s ON p.status_id = s.id 
      LEFT JOIN pengguna u ON p.pengguna_id = u.id
      LEFT JOIN eksemplar e ON p.eksemplar_id = e.id
      WHERE p.is_deleted = 0
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  } catch (error) {
    console.error('Error getting lendings with exemplar:', error);
    throw error;
  }
};
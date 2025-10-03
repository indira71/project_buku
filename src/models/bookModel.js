import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

export const getAllBooks = async (limit = 10, offset = 0, search = "") => {
  try {
    let query = `
      SELECT b.*, k.nama as kategori_nama, s.nama as status_nama, sub.nama as subjek_nama
      FROM buku b 
      LEFT JOIN kategori k ON b.kategori_id = k.id 
      LEFT JOIN status s ON b.status_id = s.id 
      LEFT JOIN subjek sub ON b.subjek_id = sub.id
      WHERE b.is_deleted = 0
    `;
    let params = [];

    if (search) {
      query += ` AND (b.judul LIKE ? OR b.edisi LIKE ? OR b.penerbit LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const offsetInt = parseInt(offset) || 0;
    const limitInt = parseInt(limit) || 10;

    query += ` ORDER BY b.created_at DESC LIMIT ${offsetInt}, ${limitInt}`;

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error getting all books:", error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT b.*, k.nama as kategori_nama, s.nama as status_nama 
      FROM buku b 
      LEFT JOIN kategori k ON b.kategori_id = k.id 
      LEFT JOIN status s ON b.status_id = s.id 
      WHERE b.id = ? AND b.is_deleted = 0
    `,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting book by id:", error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  const {
    judul,
    edisi,
    penerbit,
    deskripsi_fisik,
    sinopsis,
    lokasi_ruangan,
    tanggal_pengadaan,
    bentuk_fisik,
    jenis_sumber,
    akses_pinjam,
    kategori_id,
    status_id,
  } = bookData;

  const id = uuidv4();

  try {
    const [result] = await pool.execute(
      `
      INSERT INTO buku 
      (id, judul, edisi, penerbit, deskripsi_fisik, sinopsis, lokasi_ruangan, 
       tanggal_pengadaan, bentuk_fisik, jenis_sumber, akses_pinjam, 
       kategori_id, status_id, created_at, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `,
      [
        id,
        judul,
        edisi,
        penerbit,
        deskripsi_fisik,
        sinopsis,
        lokasi_ruangan,
        tanggal_pengadaan,
        bentuk_fisik,
        jenis_sumber,
        akses_pinjam,
        kategori_id,
        status_id,
        "system",
      ]
    );

    return { id: result.insertId, ...bookData };
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  const {
    judul,
    edisi,
    penerbit,
    deskripsi_fisik,
    sinopsis,
    lokasi_ruangan,
    tanggal_pengadaan,
    bentuk_fisik,
    jenis_sumber,
    akses_pinjam,
    kategori_id,
    status_id,
  } = bookData;

  try {
    const [result] = await pool.execute(
      `
      UPDATE buku SET 
      judul = ?, edisi = ?, penerbit = ?, deskripsi_fisik = ?, 
      sinopsis = ?, lokasi_ruangan = ?, tanggal_pengadaan = ?, 
      bentuk_fisik = ?, jenis_sumber = ?, akses_pinjam = ?, 
      kategori_id = ?, status_id = ?, updated_at = NOW(), updated_by = ?
      WHERE id = ? AND is_deleted = 0
    `,
      [
        judul,
        edisi,
        penerbit,
        deskripsi_fisik,
        sinopsis,
        lokasi_ruangan,
        tanggal_pengadaan,
        bentuk_fisik,
        jenis_sumber,
        akses_pinjam,
        kategori_id,
        status_id,
        "system",
        id,
      ]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const [result] = await pool.execute(
      "UPDATE buku SET is_deleted = 1, updated_at = NOW() WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

export const getBooksByCategory = async (categoryId) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT b.*, k.nama as kategori_nama, s.nama as status_nama 
      FROM buku b 
      LEFT JOIN kategori k ON b.kategori_id = k.id 
      LEFT JOIN status s ON b.status_id = s.id 
      WHERE b.kategori_id = ? AND b.is_deleted = 0
    `,
      [categoryId]
    );
    return rows;
  } catch (error) {
    console.error("Error getting books by category:", error);
    throw error;
  }
};

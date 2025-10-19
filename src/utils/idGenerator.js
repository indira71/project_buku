import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';

/**
 * Generate UUID v4 untuk tabel yang menggunakan CHAR(36)
 * Digunakan untuk: buku, pengguna, eksemplar, peminjaman
 */
export const generateUUID = () => {
  return uuidv4();
};

/**
 * Generate ID dengan format kode unik (contoh: KT01, ST01, PK01)
 * @param {string} tableName - Nama tabel
 * @param {string} prefix - Prefix kode (contoh: 'KT', 'ST', 'PK')
 * @param {number} digitLength - Panjang digit angka (default: 2)
 * @returns {Promise<string>} - ID yang sudah di-generate
 */
export const generateCodeId = async (tableName, prefix, digitLength = 2) => {
  try {
    // Query untuk mendapatkan ID terakhir dengan prefix yang sama
    const query = `
      SELECT id FROM ${tableName} 
      WHERE id LIKE ? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    const [rows] = await db.execute(query, [`${prefix}%`]);
    
    let nextNumber = 1;
    
    if (rows.length > 0) {
      const lastId = rows[0].id;
      const lastNumber = parseInt(lastId.substring(prefix.length));
      nextNumber = lastNumber + 1;
    }
    
    const paddedNumber = String(nextNumber).padStart(digitLength, '0');
    
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating code ID:', error);
    throw new Error('Gagal generate ID');
  }
};

/**
 * Generate ID untuk tabel kategori (KT01, KT02, ...)
 */
export const generateKategoriId = async () => {
  return await generateCodeId('kategori', 'KT', 2);
};

/**
 * Generate ID untuk tabel status (ST01, ST02, ...)
 */
export const generateStatusId = async () => {
  return await generateCodeId('status', 'ST', 2);
};

/**
 * Generate ID untuk tabel subjek (SB01, SB02, ...)
 */
export const generateSubjekId = async () => {
  return await generateCodeId('subjek', 'SB', 2);
};

/**
 * Generate ID untuk tabel pendidikan (PD01, PD02, ...)
 */
export const generatePendidikanId = async () => {
  return await generateCodeId('pendidikan', 'PD', 2);
};

/**
 * Generate ID untuk tabel agama (AG01, AG02, ...)
 */
export const generateAgamaId = async () => {
  return await generateCodeId('agama', 'AG', 2);
};

/**
 * Generate ID untuk tabel pekerjaan (PK01, PK02, ...)
 */
export const generatePekerjaanId = async () => {
  return await generateCodeId('pekerjaan', 'PK', 2);
};

/**
 * Generate ID untuk tabel jenis kelamin (JK01, JK02, ...)
 */
export const generateJkId = async () => {
  return await generateCodeId('jk', 'JK', 2);
};

/**
 * Generate ID untuk tabel perkawinan (SK01, SK02, ...)
 */
export const generatePerkawinanId = async () => {
  return await generateCodeId('perkawinan', 'SK', 2);
};

/**
 * Generate ID Anggota untuk pengguna (MBR001, MBR002, ...)
 * @returns {Promise<string>}
 */
export const generateIdAnggota = async () => {
  try {
    const query = `
      SELECT id_anggota FROM pengguna 
      WHERE id_anggota LIKE 'MBR%' 
      ORDER BY id_anggota DESC 
      LIMIT 1
    `;
    
    const [rows] = await db.execute(query);
    
    let nextNumber = 1;
    
    if (rows.length > 0) {
      const lastId = rows[0].id_anggota;
      const lastNumber = parseInt(lastId.substring(3));
      nextNumber = lastNumber + 1;
    }
    
    const paddedNumber = String(nextNumber).padStart(3, '0');
    return `MBR${paddedNumber}`;
  } catch (error) {
    console.error('Error generating ID anggota:', error);
    throw new Error('Gagal generate ID anggota');
  }
};

/**
 * Generate Nomor Induk untuk eksemplar (BK001-001, BK001-002, ...)
 * @param {string} bukuId - ID buku
 * @returns {Promise<string>}
 */
export const generateNomorInduk = async (bukuId) => {
  try {
    // Dapatkan kode buku (3 digit angka dari urutan buku)
    const bukuQuery = `
      SELECT COUNT(*) as count FROM buku 
      WHERE id <= ? AND is_deleted = 0
    `;
    const [bukuRows] = await db.execute(bukuQuery, [bukuId]);
    const bukuNumber = String(bukuRows[0].count).padStart(3, '0');
    
    // Dapatkan nomor eksemplar terakhir untuk buku ini
    const eksemplarQuery = `
      SELECT nomor_induk FROM eksemplar 
      WHERE buku_id = ? 
      ORDER BY nomor_induk DESC 
      LIMIT 1
    `;
    const [eksemplarRows] = await db.execute(eksemplarQuery, [bukuId]);
    
    let nextExemplarNumber = 1;
    
    if (eksemplarRows.length > 0) {
      const lastNomorInduk = eksemplarRows[0].nomor_induk;
      // Ekstrak nomor eksemplar (BK001-002 -> 002)
      const parts = lastNomorInduk.split('-');
      if (parts.length > 1) {
        nextExemplarNumber = parseInt(parts[1]) + 1;
      }
    }
    
    const eksemplarNumber = String(nextExemplarNumber).padStart(3, '0');
    return `BK${bukuNumber}-${eksemplarNumber}`;
  } catch (error) {
    console.error('Error generating nomor induk:', error);
    throw new Error('Gagal generate nomor induk');
  }
};

/**
 * Helper function untuk cek apakah ID sudah ada
 * @param {string} tableName - Nama tabel
 * @param {string} id - ID yang akan dicek
 * @returns {Promise<boolean>}
 */
export const isIdExists = async (tableName, id) => {
  try {
    const query = `SELECT id FROM ${tableName} WHERE id = ? LIMIT 1`;
    const [rows] = await db.execute(query, [id]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking ID existence:', error);
    return false;
  }
};

/**
 * Export semua fungsi generator dalam satu object
 */
export default {
  generateUUID,
  generateCodeId,
  generateKategoriId,
  generateStatusId,
  generateSubjekId,
  generatePendidikanId,
  generateAgamaId,
  generatePekerjaanId,
  generateJkId,
  generatePerkawinanId,
  generateIdAnggota,
  generateNomorInduk,
  isIdExists
};
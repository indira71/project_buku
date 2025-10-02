import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

export const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM pengguna WHERE email = ? AND is_deleted = 0",
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM pengguna WHERE id = ? AND is_deleted = 0",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding user by id:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const {
    nik,
    nama,
    id_anggota,
    email,
    password,
    tempat_lahir,
    tanggal_lahir,
    domisili,
    no_telepon,
    instansi,
    pekerjaan_id,
    perkawinan_id,
    pendidikan_id,
    agama_id,
    jk_id,
  } = userData;

  const userId = uuidv4();

  try {
    const [result] = await pool.execute(
      `INSERT INTO pengguna 
       (id, nik, nama, id_anggota, email, password, tempat_lahir, tanggal_lahir, domisili, no_telepon, instansi, pekerjaan_id, perkawinan_id, pendidikan_id, agama_id, jk_id, created_at, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        userId,
        nik,
        nama,
        id_anggota,
        email,
        password,
        tempat_lahir,
        tanggal_lahir,
        domisili,
        no_telepon,
        instansi,
        pekerjaan_id,
        perkawinan_id,
        pendidikan_id,
        agama_id,
        jk_id,
        "system",
      ]
    );

    return { id: result.insertId, ...userData };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateRefreshToken = async (userId, refreshToken) => {
  try {
    await pool.execute(
      "UPDATE pengguna SET refresh_token = ?, updated_at = NOW() WHERE id = ?",
      [refreshToken, userId]
    );
  } catch (error) {
    console.error("Error updating refresh token:", error);
    throw error;
  }
};

// Tambahkan fungsi ini ke userModel.js yang sudah ada

export const updateUser = async (id, userData) => {
  try {
    const fields = [];
    const values = [];

    // Build dynamic update query
    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined && userData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push("system", id);

    const query = `
      UPDATE pengguna 
      SET ${fields.join(", ")}, updated_at = NOW(), updated_by = ?
      WHERE id = ? AND is_deleted = 0
    `;

    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getAllUsers = async (limit = 10, offset = 0) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM pengguna WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const [result] = await pool.execute(
      "UPDATE pengguna SET is_deleted = 1, updated_at = NOW() WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

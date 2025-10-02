import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateRefreshToken,
} from "../models/userModel.js";

dotenv.config();
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Kata sandi salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nama: user.nama,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await updateRefreshToken(user.id, refreshToken);

    const { password: userPassword, ...userWithoutPassword } = user;

    res.json({
      message: "Login berhasil",
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const register = async (req, res) => {
  try {
    const {
      nik,
      nama,
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
    } = req.body;

    // Validasi input
    if (!nik || !nama || !email || !password) {
      return res.status(400).json({ message: "Field wajib harus diisi" });
    }

    if (password.length > 8) {
      return res
        .status(400)
        .json({ message: "Panjang password maksimal 8 karakter" });
    }

    const teleponInt = no_telepon
      ? parseInt(no_telepon.replace(/\D/g, ""))
      : null;

    // Cek apakah email sudah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const id_anggota = `USER${Date.now()}`;

    const userData = {
      nik,
      nama,
      id_anggota,
      email,
      password: hashedPassword,
      tempat_lahir,
      tanggal_lahir,
      domisili,
      no_telepon: teleponInt,
      instansi,
      pekerjaan_id,
      perkawinan_id,
      pendidikan_id,
      agama_id,
      jk_id,
    };

    const user = await createUser(userData);

    res.status(201).json({
      message: "Pengguna berhasil didaftarkan",
      data: { id: user.id, nama, email, id_anggota },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "NIK, Email, atau ID Anggota sudah terdaftar" });
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token diperlukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await findUserById(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    const newToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nama: user.nama,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Token berhasil diperbarui",
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Hapus refresh token dari database
    await updateRefreshToken(userId, null);

    res.json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

import bcrypt from 'bcryptjs';
import { 
  findUserById, 
  findUserByEmail, 
  updateUser as updateUserModel,
  getAllUsers as getAllUsersModel,
  deleteUser as deleteUserModel 
} from '../models/userModel.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    const { password, refresh_token, ...userWithoutSensitiveData } = user;
    
    res.json({
      message: 'Profil berhasil diambil',
      data: userWithoutSensitiveData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nik, nama, tempat_lahir, tanggal_lahir, domisili, no_telepon, instansi } = req.body;
    
    const userData = {
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      domisili,
      no_telepon,
      instansi
    };
    
    const updated = await updateUserModel(userId, userData);
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui profil' });
    }
    
    res.json({
      message: 'Profil berhasil diperbarui',
      data: { id: userId, ...userData }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan baru wajib diisi' });
    }
    
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password lama salah' });
    }
    
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const updated = await updateUserModel(userId, { password: hashedNewPassword });
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal mengubah password' });
    }
    
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const users = await getAllUsersModel(parseInt(limit), offset);
    
    // Remove sensitive data
    const safeUsers = users.map(user => {
      const { password, refresh_token, ...safeUser } = user;
      return safeUser;
    });
    
    res.json({
      message: 'Data pengguna berhasil diambil',
      data: safeUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    const { password, refresh_token, ...userWithoutSensitiveData } = user;
    
    res.json({
      message: 'Data pengguna berhasil diambil',
      data: userWithoutSensitiveData
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    const updated = await updateUserModel(id, userData);
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui pengguna' });
    }
    
    res.json({
      message: 'Pengguna berhasil diperbarui',
      data: { id, ...userData }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    const deleted = await deleteUserModel(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Gagal menghapus pengguna' });
    }
    
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
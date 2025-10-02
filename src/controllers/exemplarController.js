import { 
  getAllExemplars, 
  getExemplarById, 
  createExemplar, 
  updateExemplar, 
  deleteExemplar,
  getExemplarsByBook,
  getAvailableExemplars,
  updateExemplarStatus,
  getExemplarCount,
  getExemplarByNomorInduk
} from '../models/exemplarModel.js';
import { getBookById } from '../models/bookModel.js';

// Konstanta untuk status eksemplar
const STATUS = {
  TERSEDIA: 'ST01',    // Tersedia
  DIPINJAM: 'ST02',    // Dipinjam
  RUSAK: 'ST03',       // Rusak
  HILANG: 'ST04'       // Hilang
};

export const getExemplars = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', bookId } = req.query;
    const offset = (page - 1) * limit;
    
    const exemplars = await getAllExemplars(parseInt(limit), offset, search, bookId);
    const total = await getExemplarCount(bookId);
    
    res.json({
      message: 'Data eksemplar berhasil diambil',
      data: exemplars,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get exemplars error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getExemplar = async (req, res) => {
  try {
    const { id } = req.params;
    const exemplar = await getExemplarById(id);
    
    if (!exemplar) {
      return res.status(404).json({ message: 'Eksemplar tidak ditemukan' });
    }
    
    res.json({
      message: 'Data eksemplar berhasil diambil',
      data: exemplar
    });
  } catch (error) {
    console.error('Get exemplar error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getExemplarByInduk = async (req, res) => {
  try {
    const { nomorInduk } = req.params;
    const exemplar = await getExemplarByNomorInduk(nomorInduk);
    
    if (!exemplar) {
      return res.status(404).json({ message: 'Eksemplar tidak ditemukan' });
    }
    
    res.json({
      message: 'Data eksemplar berhasil diambil',
      data: exemplar
    });
  } catch (error) {
    console.error('Get exemplar by nomor induk error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const addExemplar = async (req, res) => {
  try {
    const exemplarData = req.body;
    
    // Validasi input dasar
    if (!exemplarData.nomor_induk || !exemplarData.buku_id) {
      return res.status(400).json({ message: 'Nomor induk dan ID buku wajib diisi' });
    }
    
    // Cek apakah buku ada
    const book = await getBookById(exemplarData.buku_id);
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    // Set default values menggunakan konstanta STATUS
    if (!exemplarData.status) {
      exemplarData.status = STATUS.TERSEDIA; // Default: ST01 - Tersedia
    }
    
    if (exemplarData.opac === undefined) {
      exemplarData.opac = '1'; // Default: Tampil di OPAC
    }
    
    const newExemplar = await createExemplar(exemplarData);
    
    res.status(201).json({
      message: 'Eksemplar berhasil ditambahkan',
      data: newExemplar
    });
  } catch (error) {
    console.error('Add exemplar error:', error);
    if (error.message === 'Nomor induk sudah ada') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const editExemplar = async (req, res) => {
  try {
    const { id } = req.params;
    const exemplarData = req.body;
    
    const existingExemplar = await getExemplarById(id);
    if (!existingExemplar) {
      return res.status(404).json({ message: 'Eksemplar tidak ditemukan' });
    }
    
    // Cek apakah buku ada jika buku_id diubah
    if (exemplarData.buku_id) {
      const book = await getBookById(exemplarData.buku_id);
      if (!book) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
      }
    }
    
    const updated = await updateExemplar(id, exemplarData);
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui eksemplar' });
    }
    
    res.json({
      message: 'Eksemplar berhasil diperbarui',
      data: { id, ...exemplarData }
    });
  } catch (error) {
    console.error('Edit exemplar error:', error);
    if (error.message === 'Nomor induk sudah ada') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const removeExemplar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingExemplar = await getExemplarById(id);
    if (!existingExemplar) {
      return res.status(404).json({ message: 'Eksemplar tidak ditemukan' });
    }
    
    // Cek apakah eksemplar sedang dipinjam menggunakan konstanta
    if (existingExemplar.status === STATUS.DIPINJAM) {
      return res.status(400).json({ message: 'Eksemplar sedang dipinjam, tidak dapat dihapus' });
    }
    
    const deleted = await deleteExemplar(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Gagal menghapus eksemplar' });
    }
    
    res.json({ message: 'Eksemplar berhasil dihapus' });
  } catch (error) {
    console.error('Remove exemplar error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getExemplarsByBooks = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Cek apakah buku ada
    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    const exemplars = await getExemplarsByBook(bookId);
    
    res.json({
      message: 'Data eksemplar berhasil diambil',
      data: {
        book: book,
        exemplars: exemplars,
        total: exemplars.length
      }
    });
  } catch (error) {
    console.error('Get exemplars by book error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getAvailableExemplarsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Cek apakah buku ada
    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    const exemplars = await getAvailableExemplars(bookId);
    
    res.json({
      message: 'Data eksemplar tersedia berhasil diambil',
      data: {
        book: book,
        availableExemplars: exemplars,
        availableCount: exemplars.length
      }
    });
  } catch (error) {
    console.error('Get available exemplars error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateExemplarStatusOnly = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi' });
    }
    
    // Validasi status (harus salah satu dari ST01, ST02, ST03, ST04)
    const validStatuses = Object.values(STATUS);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Status tidak valid. Gunakan: ST01 (Tersedia), ST02 (Dipinjam), ST03 (Rusak), atau ST04 (Hilang)' 
      });
    }
    
    const existingExemplar = await getExemplarById(id);
    if (!existingExemplar) {
      return res.status(404).json({ message: 'Eksemplar tidak ditemukan' });
    }
    
    const updated = await updateExemplarStatus(id, status);
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui status eksemplar' });
    }
    
    res.json({
      message: 'Status eksemplar berhasil diperbarui',
      data: { id, status }
    });
  } catch (error) {
    console.error('Update exemplar status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getExemplarStats = async (req, res) => {
  try {
    const { bookId } = req.query;
    
    // Menggunakan konstanta STATUS untuk query
    const totalExemplars = await getExemplarCount(bookId);
    const availableExemplars = await getExemplarCount(bookId, STATUS.TERSEDIA);
    const borrowedExemplars = await getExemplarCount(bookId, STATUS.DIPINJAM);
    const damagedExemplars = await getExemplarCount(bookId, STATUS.RUSAK);
    const lostExemplars = await getExemplarCount(bookId, STATUS.HILANG);
    
    res.json({
      message: 'Statistik eksemplar berhasil diambil',
      data: {
        total: totalExemplars,
        available: availableExemplars,
        borrowed: borrowedExemplars,
        damaged: damagedExemplars,
        lost: lostExemplars,
        bookId: bookId || 'all'
      }
    });
  } catch (error) {
    console.error('Get exemplar stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
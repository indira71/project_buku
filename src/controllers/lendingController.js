import {
  createLending,
  getLendingsByUser,
  getAllLendings,
  getLendingById,
  updateLendingStatus,
  getOverdueLendings,
  createLendingWithExemplar,
  returnLendingWithExemplar,
} from "../models/lendingModel.js";
import { getBookById } from "../models/bookModel.js";
import { getAvailableExemplars, getExemplarById } from "../models/exemplarModel.js";
import { validateBookForLending } from "../utils/bookValidation.js";

// Konstanta untuk status
const STATUS = {
  TERSEDIA: 'ST01',    // Tersedia
  DIPINJAM: 'ST02',    // Dipinjam
  RUSAK: 'ST03',       // Rusak
  HILANG: 'ST04'       // Hilang
};

export const borrowBook = async (req, res) => {
  try {
    const { buku_id, tenggat_kembali, keterangan } = req.body;
    const pengguna_id = req.user.id;

    if (!buku_id || !tenggat_kembali) {
      return res
        .status(400)
        .json({ message: "ID buku dan tenggat kembali wajib diisi" });
    }

    // Cek ketersediaan buku
    const book = await getBookById(buku_id);
    if (!book) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    const lendingData = {
      tanggal_pinjam: new Date(),
      tenggat_kembali,
      keterangan: keterangan || null,
      status_id: STATUS.DIPINJAM,
      buku_id,
      pengguna_id,
    };

    const newLending = await createLending(lendingData);

    res.status(201).json({
      message: "Peminjaman buku berhasil",
      data: newLending,
    });
  } catch (error) {
    console.error("Borrow book error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getUserLendings = async (req, res) => {
  try {
    const userId = req.user.id;
    const lendings = await getLendingsByUser(userId);

    res.json({
      message: "Data peminjaman berhasil diambil",
      data: lendings,
    });
  } catch (error) {
    console.error("Get user lendings error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getLendings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const lendings = await getAllLendings(parseInt(limit), offset);

    res.json({
      message: "Data peminjaman berhasil diambil",
      data: lendings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get lendings error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getLending = async (req, res) => {
  try {
    const { id } = req.params;
    const lending = await getLendingById(id);

    if (!lending) {
      return res
        .status(404)
        .json({ message: "Data peminjaman tidak ditemukan" });
    }

    res.json({
      message: "Data peminjaman berhasil diambil",
      data: lending,
    });
  } catch (error) {
    console.error("Get lending error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const lending = await getLendingById(id);
    if (!lending) {
      return res
        .status(404)
        .json({ message: "Data peminjaman tidak ditemukan" });
    }

    // Status setelah dikembalikan bisa ST01 (Tersedia) atau custom status "Dikembalikan"
    // Karena di database hanya ada 4 status, kita gunakan ST01 (Tersedia)
    const updated = await updateLendingStatus(id, STATUS.TERSEDIA, new Date());

    if (!updated) {
      return res.status(400).json({ message: "Gagal mengembalikan buku" });
    }

    res.json({ message: "Buku berhasil dikembalikan" });
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await getOverdueLendings();

    res.json({
      message: "Data buku terlambat berhasil diambil",
      data: overdueBooks,
    });
  } catch (error) {
    console.error("Get overdue books error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const borrowBookWithExemplar = async (req, res) => {
  try {
    const { buku_id, tenggat_kembali, keterangan, eksemplar_id } = req.body;
    const pengguna_id = req.user.id;

    // Validasi input
    if (!buku_id || !tenggat_kembali) {
      return res.status(400).json({
        message: "ID buku dan tenggat kembali wajib diisi",
      });
    }

    // Cek dan validasi buku
    const book = await getBookById(buku_id);
    const bookValidation = validateBookForLending(book);

    if (!bookValidation.valid) {
      return res.status(bookValidation.statusCode).json({
        message: bookValidation.message,
      });
    }

    // Pilih eksemplar
    let selectedExemplar = null;

    if (eksemplar_id) {
      const exemplar = await getExemplarById(eksemplar_id);
      if (!exemplar) {
        return res.status(404).json({
          message: "Eksemplar tidak ditemukan",
        });
      }
      // Cek apakah eksemplar tersedia (ST01)
      if (exemplar.status !== STATUS.TERSEDIA) {
        return res.status(400).json({
          message: "Eksemplar tidak tersedia untuk dipinjam",
        });
      }
      if (exemplar.buku_id !== buku_id) {
        return res.status(400).json({
          message: "Eksemplar tidak sesuai dengan buku",
        });
      }
      selectedExemplar = exemplar;
    } else {
      const availableExemplars = await getAvailableExemplars(buku_id);
      if (availableExemplars.length === 0) {
        return res.status(400).json({
          message: "Tidak ada eksemplar yang tersedia untuk dipinjam",
        });
      }
      selectedExemplar = availableExemplars[0];
    }

    // Buat peminjaman dengan status ST02 (Dipinjam)
    const lendingData = {
      tanggal_pinjam: new Date(),
      tenggat_kembali,
      keterangan: keterangan || null,
      status_id: STATUS.DIPINJAM, // Status peminjaman: Dipinjam
      buku_id,
      pengguna_id,
      eksemplar_id: selectedExemplar.id,
    };

    const newLending = await createLendingWithExemplar(lendingData);

    res.status(201).json({
      message: "Peminjaman buku berhasil",
      data: {
        ...newLending,
        eksemplar: {
          id: selectedExemplar.id,
          nomor_induk: selectedExemplar.nomor_induk,
        },
      },
    });
  } catch (error) {
    console.error("Borrow book with exemplar error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const returnBookWithExemplar = async (req, res) => {
  try {
    const { id } = req.params;

    const lending = await getLendingById(id);
    if (!lending) {
      return res
        .status(404)
        .json({ message: "Data peminjaman tidak ditemukan" });
    }

    // Cek apakah sudah dikembalikan (status ST01 = Tersedia berarti sudah dikembalikan)
    if (lending.status_id === STATUS.TERSEDIA) {
      return res.status(400).json({ message: "Buku sudah dikembalikan" });
    }

    const returned = await returnLendingWithExemplar(id, new Date());

    if (!returned) {
      return res.status(400).json({ message: "Gagal mengembalikan buku" });
    }

    res.json({ message: "Buku berhasil dikembalikan" });
  } catch (error) {
    console.error("Return book with exemplar error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
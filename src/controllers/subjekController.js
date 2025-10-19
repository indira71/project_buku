import {
  getAllSubjeks,
  getSubjekById,
  createSubjek,
  updateSubjek,
  deleteSubjek,
} from "../models/subjekModel.js";
import { generateSubjekId } from "../utils/idGenerator.js";

export const getSubjeks = async (req, res) => {
  try {
    const subjeks = await getAllSubjeks();

    res.json({
      message: "Data subjek berhasil diambil",
      data: subjeks,
    });
  } catch (error) {
    console.error("Get subjeks error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getSubjek = async (req, res) => {
  try {
    const { id } = req.params;
    const subjek = await getSubjekById(id);

    if (!subjek) {
      return res.status(404).json({ message: "Subjek tidak ditemukan" });
    }

    res.json({
      message: "Data subjek berhasil diambil",
      data: subjek,
    });
  } catch (error) {
    console.error("Get subjek error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const addSubjek = async (req, res) => {
  try {
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({ message: "Nama subjek wajib diisi" });
    }

    const id = await generateSubjekId();

    console.log("Generated Subjek ID:", id);

    const newSubjek = await createSubjek({ id, nama });

    res.status(201).json({
      message: "Subjek berhasil ditambahkan",
      data: newSubjek,
    });
  } catch (error) {
    console.error("Add subjek error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const editSubjek = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({ message: "Nama subjek wajib diisi" });
    }

    const existingSubjek = await getSubjekById(id);
    if (!existingSubjek) {
      return res.status(404).json({ message: "Subjek tidak ditemukan" });
    }

    const updated = await updateSubjek(id, { nama });

    if (!updated) {
      return res.status(400).json({ message: "Gagal memperbarui subjek" });
    }

    res.json({
      message: "Subjek berhasil diperbarui",
      data: { id, nama },
    });
  } catch (error) {
    console.error("Edit subjek error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const removeSubjek = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSubjek = await getSubjekById(id);
    if (!existingSubjek) {
      return res.status(404).json({ message: "Subjek tidak ditemukan" });
    }

    const deleted = await deleteSubjek(id);

    if (!deleted) {
      return res.status(400).json({ message: "Gagal menghapus subjek" });
    }

    res.json({ message: "Subjek berhasil dihapus" });
  } catch (error) {
    console.error("Remove subjek error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

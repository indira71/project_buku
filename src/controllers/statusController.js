import { 
  getAllStatuses, 
  getStatusById, 
  createStatus, 
  updateStatus, 
  deleteStatus 
} from '../models/statusModel.js';

export const getStatuses = async (req, res) => {
  try {
    const statuses = await getAllStatuses();
    
    res.json({
      message: 'Data status berhasil diambil',
      data: statuses
    });
  } catch (error) {
    console.error('Get statuses error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await getStatusById(id);
    
    if (!status) {
      return res.status(404).json({ message: 'Status tidak ditemukan' });
    }
    
    res.json({
      message: 'Data status berhasil diambil',
      data: status
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const addStatus = async (req, res) => {
  try {
    const { nama } = req.body;
    
    if (!nama) {
      return res.status(400).json({ message: 'Nama status wajib diisi' });
    }
    
    const newStatus = await createStatus({ nama });
    
    res.status(201).json({
      message: 'Status berhasil ditambahkan',
      data: newStatus
    });
  } catch (error) {
    console.error('Add status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const editStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    
    if (!nama) {
      return res.status(400).json({ message: 'Nama status wajib diisi' });
    }
    
    const existingStatus = await getStatusById(id);
    if (!existingStatus) {
      return res.status(404).json({ message: 'Status tidak ditemukan' });
    }
    
    const updated = await updateStatus(id, { nama });
    
    if (!updated) {
      return res.status(400).json({ message: 'Gagal memperbarui status' });
    }
    
    res.json({
      message: 'Status berhasil diperbarui',
      data: { id, nama }
    });
  } catch (error) {
    console.error('Edit status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const removeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingStatus = await getStatusById(id);
    if (!existingStatus) {
      return res.status(404).json({ message: 'Status tidak ditemukan' });
    }
    
    const deleted = await deleteStatus(id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Gagal menghapus status' });
    }
    
    res.json({ message: 'Status berhasil dihapus' });
  } catch (error) {
    console.error('Remove status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
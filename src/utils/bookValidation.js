export const validateBookForLending = (book) => {
  if (!book) {
    return {
      valid: false,
      statusCode: 404,
      message: 'Buku tidak ditemukan'
    };
  }

  // Cek soft delete
  if (book.is_deleted === 1) {
    return {
      valid: false,
      statusCode: 404,
      message: 'Buku tidak ditemukan'
    };
  }

  // Validasi akses pinjam
  if (book.akses_pinjam === 0 || book.akses_pinjam === '0') {
    return {
      valid: false,
      statusCode: 403,
      message: 'Buku ini tidak dapat dipinjam. Hanya untuk dibaca di perpustakaan.'
    };
  }

  // Validasi status buku (jika ada)
  if (book.status_id === '3' || book.status_id === 3) { // Rusak
    return {
      valid: false,
      statusCode: 400,
      message: 'Buku dalam kondisi rusak, tidak dapat dipinjam'
    };
  }

  return { valid: true };
};
-- Membuat database
CREATE DATABASE IF NOT EXISTS perpustakaan;
USE perpustakaan;

-- Tabel status
CREATE TABLE IF NOT EXISTS status (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default status dengan kode unik
INSERT IGNORE INTO status (id, nama, created_at, created_by) VALUES
('ST01', 'Tersedia', NOW(), 'system'),
('ST02', 'Dipinjam', NOW(), 'system'),
('ST03', 'Rusak', NOW(), 'system'),
('ST04', 'Hilang', NOW(), 'system');

-- Tabel kategori
CREATE TABLE IF NOT EXISTS kategori (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default categories dengan kode unik
INSERT IGNORE INTO kategori (id, nama, created_at, created_by) VALUES
('KT01', 'Teknologi', NOW(), 'system'),
('KT02', 'Sastra', NOW(), 'system'),
('KT03', 'Sejarah', NOW(), 'system'),
('KT04', 'Sains', NOW(), 'system');

-- Tabel subjek
CREATE TABLE IF NOT EXISTS subjek (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default subjects dengan kode unik
INSERT IGNORE INTO subjek (id, nama, created_at, created_by) VALUES
('SB01', 'Pemrograman', NOW(), 'system'),
('SB02', 'Novel', NOW(), 'system'),
('SB03', 'Perang Dunia', NOW(), 'system'),
('SB04', 'Fisika', NOW(), 'system');

-- Tabel pendidikan
CREATE TABLE IF NOT EXISTS pendidikan (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default education levels dengan kode unik
INSERT IGNORE INTO pendidikan (id, nama, created_at, created_by) VALUES
('PD01', 'SD', NOW(), 'system'),
('PD02', 'SMP', NOW(), 'system'),
('PD03', 'SMA', NOW(), 'system'),
('PD04', 'D3', NOW(), 'system'),
('PD05', 'S1', NOW(), 'system'),
('PD06', 'S2', NOW(), 'system'),
('PD07', 'S3', NOW(), 'system');

-- Tabel agama
CREATE TABLE IF NOT EXISTS agama (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default religions dengan kode unik
INSERT IGNORE INTO agama (id, nama, created_at, created_by) VALUES
('AG01', 'Islam', NOW(), 'system'),
('AG02', 'Kristen', NOW(), 'system'),
('AG03', 'Katolik', NOW(), 'system'),
('AG04', 'Hindu', NOW(), 'system'),
('AG05', 'Buddha', NOW(), 'system'),
('AG06', 'Konghucu', NOW(), 'system');

-- Tabel pekerjaan
CREATE TABLE IF NOT EXISTS pekerjaan (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default jobs dengan kode unik
INSERT IGNORE INTO pekerjaan (id, nama, created_at, created_by) VALUES
('PK01', 'Pelajar/Mahasiswa', NOW(), 'system'),
('PK02', 'PNS', NOW(), 'system'),
('PK03', 'Karyawan Swasta', NOW(), 'system'),
('PK04', 'Wiraswasta', NOW(), 'system'),
('PK05', 'Dokter', NOW(), 'system'),
('PK06', 'Guru/Dosen', NOW(), 'system'),
('PK07', 'Petani', NOW(), 'system'),
('PK08', 'Nelayan', NOW(), 'system'),
('PK09', 'TNI', NOW(), 'system'),
('PK10', 'Polri', NOW(), 'system'),
('PK11', 'Ibu Rumah Tangga', NOW(), 'system'),
('PK12', 'Pensiunan', NOW(), 'system'),
('PK13', 'Seniman', NOW(), 'system'),
('PK14', 'Buruh', NOW(), 'system'),
('PK15', 'Sopir', NOW(), 'system'),
('PK16', 'Pedagang', NOW(), 'system'),
('PK17', 'Programmer', NOW(), 'system'),
('PK18', 'Penulis', NOW(), 'system'),
('PK19', 'Lainnya', NOW(), 'system');

-- Tabel jk (Jenis Kelamin)
CREATE TABLE IF NOT EXISTS jk (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default gender dengan kode unik
INSERT IGNORE INTO jk (id, nama, created_at, created_by) VALUES
('JK01', 'Laki-laki', NOW(), 'system'),
('JK02', 'Perempuan', NOW(), 'system');

-- Tabel perkawinan
CREATE TABLE IF NOT EXISTS perkawinan (
  id VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255)
);

-- Insert default marital status dengan kode unik
INSERT IGNORE INTO perkawinan (id, nama, created_at, created_by) VALUES
('SK01', 'Belum Menikah', NOW(), 'system'),
('SK02', 'Menikah', NOW(), 'system'),
('SK03', 'Cerai Hidup', NOW(), 'system'),
('SK04', 'Cerai Mati', NOW(), 'system');

-- Tabel pengguna (menggunakan UUID)
CREATE TABLE IF NOT EXISTS pengguna (
  id CHAR(36) PRIMARY KEY,
  nik VARCHAR(16) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  id_anggota VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,
  domisili VARCHAR(255),
  no_telepon VARCHAR(20),
  instansi VARCHAR(255),
  refresh_token VARCHAR(400),
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  -- Foreign Keys dengan kode unik
  pekerjaan_id VARCHAR(10),
  perkawinan_id VARCHAR(10),
  pendidikan_id VARCHAR(10),
  agama_id VARCHAR(10),
  jk_id VARCHAR(10),
  FOREIGN KEY (pekerjaan_id) REFERENCES pekerjaan(id),
  FOREIGN KEY (perkawinan_id) REFERENCES perkawinan(id),
  FOREIGN KEY (pendidikan_id) REFERENCES pendidikan(id),
  FOREIGN KEY (agama_id) REFERENCES agama(id),
  FOREIGN KEY (jk_id) REFERENCES jk(id)
);

-- Tabel buku (menggunakan UUID)
CREATE TABLE IF NOT EXISTS buku (
  id CHAR(36) PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  edisi VARCHAR(255),
  penerbit VARCHAR(255) NOT NULL,
  deskripsi_fisik VARCHAR(255),
  sinopsis VARCHAR(255),
  lokasi_ruangan VARCHAR(255),
  tanggal_pengadaan VARCHAR(255),
  bentuk_fisik VARCHAR(255),
  jenis_sumber VARCHAR(255),
  akses_pinjam TINYINT DEFAULT 1,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  -- Foreign Keys dengan kode unik
  kategori_id VARCHAR(10),
  subjek_id VARCHAR(10),
  status_id VARCHAR(10),
  FOREIGN KEY (kategori_id) REFERENCES kategori(id),
  FOREIGN KEY (subjek_id) REFERENCES subjek(id),
  FOREIGN KEY (status_id) REFERENCES status(id)
);

-- Tabel eksemplar (menggunakan UUID)
CREATE TABLE IF NOT EXISTS eksemplar (
  id CHAR(36) PRIMARY KEY,
  nomor_induk VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(10) NOT NULL,
  opac VARCHAR(255),
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  -- Foreign Key
  buku_id CHAR(36),
  FOREIGN KEY (buku_id) REFERENCES buku(id)
);

-- Tabel peminjaman (menggunakan UUID)
CREATE TABLE IF NOT EXISTS peminjaman (
  id CHAR(36) PRIMARY KEY,
  tanggal_pinjam DATETIME NOT NULL,
  tenggat_kembali DATETIME NOT NULL,
  tanggal_kembali DATETIME,
  keterangan TEXT,
  is_deleted TINYINT DEFAULT 0,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  -- Foreign Keys
  status_id VARCHAR(10),
  buku_id CHAR(36),
  pengguna_id CHAR(36),
  eksemplar_id CHAR(36),
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (buku_id) REFERENCES buku(id),
  FOREIGN KEY (pengguna_id) REFERENCES pengguna(id),
  FOREIGN KEY (eksemplar_id) REFERENCES eksemplar(id)
);

-- ===== INSERT DATA CONTOH =====
-- Insert sample buku dengan UUID dan foreign key kode unik
INSERT IGNORE INTO buku (id, judul, edisi, penerbit, kategori_id, subjek_id, status_id, created_at, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Belajar JavaScript', '1st Edition', 'Tech Publisher', 'KT01', 'SB01', 'ST01', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440102', 'Novel Laskar Pelangi', '2nd Edition', 'Mizan', 'KT02', 'SB02', 'ST01', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440103', 'JavaScript: The Complete Guide', '1st Edition', 'Tech Publisher', 'KT01', 'SB01', 'ST01', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440104', 'Laskar Pelangi', '15th Edition', 'Bentang Pustaka', 'KT02', 'SB02', 'ST01', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440105', 'Database Design Fundamentals', '3rd Edition', 'McGraw Hill', 'KT01', 'SB01', 'ST01', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440106', 'Sejarah Indonesia Modern', '2nd Edition', 'Gramedia', 'KT03', 'SB03', 'ST01', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440107', 'Fisika Dasar untuk Universitas', '4th Edition', 'Erlangga', 'KT04', 'SB04', 'ST01', NOW(), 'system');

-- Insert sample pengguna
INSERT IGNORE INTO pengguna (id, nik, nama, id_anggota, email, password, pekerjaan_id, jk_id, agama_id, created_at, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440201', '1234567890123456', 'John Doe', 'MBR001', 'john@example.com', 'password', 'PK01', 'JK01', 'AG01', NOW(), 'system');

-- Insert sample eksemplar
INSERT IGNORE INTO eksemplar (id, nomor_induk, status, opac, buku_id, created_at, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440301', 'BK001-001', 'ST01', '1', '550e8400-e29b-41d4-a716-446655440101', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440302', 'BK001-002', 'ST01', '1', '550e8400-e29b-41d4-a716-446655440101', NOW(), 'system'),
('550e8400-e29b-41d4-a716-446655440303', 'BK001-003', 'ST02', '1', '550e8400-e29b-41d4-a716-446655440101', NOW(), 'system');

agama
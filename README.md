# 📚 Project Buku API

API sederhana untuk mengelola **buku**, **eksemplar**, dan **peminjaman** dalam sistem perpustakaan.  
Dibuat dengan **Node.js + Express.js** dan **MySQL**.

---

## ⚙️ Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/project_buku.git
   cd project_buku
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Buat file `.env`** untuk konfigurasi database
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=perpustakaan
   ```

4. **Buat database & import schema**
   - Buat database baru:
     ```sql
     CREATE DATABASE perpustakaan;
     ```
   - Import file schema:
     ```bash
     mysql -u root -p perpustakaan < schema.sql
     ```

5. **Jalankan server**
   ```bash
   npm start
   ```
   API akan berjalan di: [http://localhost:3000](http://localhost:3000)

---

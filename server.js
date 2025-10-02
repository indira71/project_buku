import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import lendingRoutes from "./src/routes/lendingRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import statusRoutes from "./src/routes/statusRoutes.js";
import exemplarRoutes from './src/routes/exemplarRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/lendings", lendingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/status", statusRoutes);
app.use('/api/exemplars', exemplarRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Book Lending System API is running",
    timestamp: new Date().toISOString(),
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Book Lending System API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "Login user",
        "POST /api/auth/refresh": "Refresh access token",
        "POST /api/auth/logout": "Logout user",
      },
      books: {
        "GET /api/books": "Get all books",
        "GET /api/books/:id": "Get book by ID",
        "GET /api/books/category/:categoryId": "Get books by category",
        "POST /api/books": "Add new book (auth required)",
        "PUT /api/books/:id": "Update book (auth required)",
        "DELETE /api/books/:id": "Delete book (auth required)",
      },
      lendings: {
        "POST /api/lendings/borrow": "Borrow book (auth required)",
        "GET /api/lendings/my-lendings": "Get user lendings (auth required)",
        "GET /api/lendings/overdue": "Get overdue books (auth required)",
        "GET /api/lendings": "Get all lendings (auth required)",
        "GET /api/lendings/:id": "Get lending by ID (auth required)",
        "PUT /api/lendings/:id/return": "Return book (auth required)",
      },
      categories: {
        "GET /api/categories": "Get all categories",
        "GET /api/categories/:id": "Get category by ID",
        "POST /api/categories": "Add new category (auth required)",
        "PUT /api/categories/:id": "Update category (auth required)",
        "DELETE /api/categories/:id": "Delete category (auth required)",
      },
      users: {
        "GET /api/users/profile": "Get user profile (auth required)",
        "PUT /api/users/profile": "Update user profile (auth required)",
        "PUT /api/users/change-password": "Change password (auth required)",
        "GET /api/users": "Get all users (auth required)",
        "GET /api/users/:id": "Get user by ID (auth required)",
        "PUT /api/users/:id": "Update user (auth required)",
        "DELETE /api/users/:id": "Delete user (auth required)",
      },
      status: {
        "GET /api/status": "Get all statuses",
        "GET /api/status/:id": "Get status by ID",
        "POST /api/status": "Add new status (auth required)",
        "PUT /api/status/:id": "Update status (auth required)",
        "DELETE /api/status/:id": "Delete status (auth required)",
      },
      exemplars: {
        "GET /api/exemplars": "Get all exemplars",
        "GET /api/exemplars/:id": "Get exemplar by ID",
        "GET /api/exemplars/nomor/:nomorInduk": "Get exemplar by nomor induk",
        "GET /api/exemplars/book/:bookId": "Get exemplars by book",
        "GET /api/exemplars/book/:bookId/available":
          "Get available exemplars by book",
        "GET /api/exemplars/stats": "Get exemplar statistics",
        "POST /api/exemplars": "Add new exemplar (auth required)",
        "PUT /api/exemplars/:id": "Update exemplar (auth required)",
        "PUT /api/exemplars/:id/status":
          "Update exemplar status (auth required)",
        "DELETE /api/exemplars/:id": "Delete exemplar (auth required)",
      },
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: "Data tidak valid", details: err.message });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Tidak memiliki akses" });
  }

  // Default error
  res.status(500).json({ message: "Terjadi kesalahan server" });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ 
      message: 'Database connected successfully',
      result: rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan",
    availableEndpoints: "/api",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API documentation: http://localhost:${PORT}/api`);
});

export default app;

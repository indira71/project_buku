import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserById } from '../models/userModel.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token akses diperlukan' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({
  path: process.cwd() + '/.env'
});

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';

const app = express();

// app.use(cors());
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Ok");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/borrow', borrowRoutes);

// Start server
console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);
connectDB().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
});

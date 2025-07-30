// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from "./routes/route.js"
// Load environment variables from .env file
dotenv.config();

// Debug: Check if JWT_SECRET is loaded
console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

import connectDB from './config/db.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000' // Your frontend URL
}));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Ok");
});
app.get("/login",(req,res)=>{
  res.send("Bhayo Login Jau aba")
})

// Routes


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use("/api", routes);
// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/borrow', borrowRoutes);

// Start server

connectDB().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(` Server running on port http://localhost:${PORT}`));
});



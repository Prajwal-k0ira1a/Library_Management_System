// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/route.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import connectDB from "./config/db.js";
// Load environment variables from .env file
dotenv.config();
const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
// Deployment
app.use(
  cors({
    origin: [
      "https://library-frontend-taupe.vercel.app",
      "http://localhost:5173",
      "https://library-management-system-lxk1.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Library Management System Backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/login", (req, res) => {
  res.send("Bhayo Login Jau aba");
});
export async function seedAdmin() {
  const adminEmail = "admin@library.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "librarian",
      isActive: true,
    });
    console.log("Seeded admin user");
  } else {
    console.log("Admin user already exists");
  }
}
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.use("/api", routes);

connectDB().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () =>
    console.log(` Server running on port http://localhost:${PORT}`)
  );
});

seedAdmin();

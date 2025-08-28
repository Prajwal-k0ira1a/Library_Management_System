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

// Debug: Check if JWT_SECRET is loaded
// console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
// console.log("PORT:", process.env.PORT);
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
    origin: "https://library-frontend-taupe.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Ok");
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

// seedAdmin();

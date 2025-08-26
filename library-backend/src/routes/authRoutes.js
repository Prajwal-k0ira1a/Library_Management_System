import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { uploadUserImage } from "../config/cloudinary.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";
import { limiter } from "../middleware/auth.js";
const router = express.Router();

// Public routes (no authentication required)
router.post("/register", uploadUserImage.single("profileImage"), registerUser); // Allow public registration
router.post("/login", limiter, loginUser);

// Routes requiring authentication
router.post("/logout", [authenticateToken], logoutUser);

export default router;

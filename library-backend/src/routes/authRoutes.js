import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import {uploadUserImage } from "../config/cloudinary.js";
import { authenticateToken,checkRole } from "../middleware/auth.js";
import {limiter} from "../middleware/auth.js";
const router = express.Router();

router.post("/register", [authenticateToken, checkRole("librarian")], uploadUserImage.single("profileImage"), registerUser);
router.post("/login", limiter, loginUser);
router.post("/logout", logoutUser);

export default router;

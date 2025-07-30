import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { upload } from "../config/cloudinary.js";
import {limiter} from "../middleware/auth.js";
const router = express.Router();

router.post("/register", upload.single('profileImage'), registerUser);
router.post("/login",limiter, loginUser);
router.post("/logout", logoutUser);

export default router;

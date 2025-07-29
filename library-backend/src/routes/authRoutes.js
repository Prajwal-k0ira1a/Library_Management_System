import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/register", upload.single('profileImage'), registerUser);
router.post("/login", loginUser);

export default router;

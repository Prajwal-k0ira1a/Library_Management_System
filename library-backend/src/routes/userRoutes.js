import express from "express";
import {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  softDelete,
} from "../controllers/userController.js";
import { uploadUserImage } from "../config/cloudinary.js";
import { checkRole, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Librarian only routes
router.get("/all", [authenticateToken, checkRole("librarian")], getUsers);
router.get(
  "/get/:id",
  [authenticateToken, checkRole("librarian")],
  getUserById
);

// Routes accessible by both borrowers and librarians
router.get("/me", authenticateToken, getCurrentUser);
router.put(
  "/update/:id",
  [authenticateToken, uploadUserImage.single("profileImage")],
  updateUser
);

// Soft delete - only allow users to delete their own account or librarians to delete any
router.delete("/delete/:id", [authenticateToken], softDelete);

export default router;

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

router.get("/all", [authenticateToken, checkRole("librarian")], getUsers);
router.get(
  "/get/:id",
  [authenticateToken, checkRole("librarian")],
  getUserById
);
router.get("/me", authenticateToken, getCurrentUser);
router.delete(
  "/delete/:id",
  [authenticateToken, checkRole("librarian")],
  softDelete
);
router.put("/update/:id", uploadUserImage.single("profileImage"), updateUser);

export default router;

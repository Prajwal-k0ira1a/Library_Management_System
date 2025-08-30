import express from "express";
import { uploadBookImages } from "../config/cloudinary.js";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { checkRole, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/getAll", getBooks); // Public access for browsing books
router.get("/getBookById/:id",getBookById); 
// Librarian only routes
router.post(
  "/create",
  [
    authenticateToken,
    checkRole("librarian"),
    uploadBookImages.array("bookImages", 2),
  ],
  createBook
);
router.put(
  "/update/:id",
  [
    authenticateToken,
    checkRole("librarian"),
    uploadBookImages.array("bookImages", 2),
  ],
  updateBook
);
router.delete(
  "/delete/:id",
  [authenticateToken, checkRole("librarian")],
  deleteBook
);

export default router;

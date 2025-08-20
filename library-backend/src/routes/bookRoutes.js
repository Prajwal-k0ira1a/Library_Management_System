import express from "express";
import { uploadBookImages } from "../config/cloudinary.js";
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { checkRole, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  [
    authenticateToken,
    checkRole("librarian"),
    uploadBookImages.array("bookImages", 2),
  ],
  createBook
);
router.get("/getAll", getBooks);
router.put(
  "/update/:id",
  [authenticateToken, checkRole("librarian")],
  updateBook
);
router.delete(
  "/delete/:id",
  [authenticateToken, checkRole("librarian")],
  deleteBook
);

export default router;

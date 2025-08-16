import express from "express";
import { uploadBookImages } from "../config/cloudinary.js";
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  uploadBookImages.array("bookImages", 2),
  protect,
  authorize("librarian"),
  createBook
);
router.get("/getAll", getBooks);
router.put("/:id", protect, authorize("librarian"), updateBook);
router.delete("/:id", protect, authorize("librarian"), deleteBook);

export default router;

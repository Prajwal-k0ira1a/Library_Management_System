import express from "express";
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, authorize("librarian"), createBook);
router.get("/getAll", getBooks);
router.put("/:id", protect, authorize("librarian"), updateBook);
router.delete("/:id", protect, authorize("librarian"), deleteBook);

export default router;

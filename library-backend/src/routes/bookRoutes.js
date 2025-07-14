import express from "express";
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/", createBook);
router.get("/", getBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;

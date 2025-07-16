import express from "express";
import { borrowBook, returnBook } from "../controllers/borrowController.js";

const router = express.Router();

router.post("/borrow", borrowBook);
router.post("/return", returnBook);

export default router;

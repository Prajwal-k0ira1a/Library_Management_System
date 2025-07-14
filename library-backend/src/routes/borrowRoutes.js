import express from "express";
import { borrowBook, returnBook } from "../controllers/borrowController.js";

const router = express.Router();

router.post("/", borrowBook);
router.post("/return", returnBook);

export default router;

import express from "express";
import { borrowBook, getAllBorrowRecords, returnBook, renewBook, calculateFine } from "../controllers/borrowController.js";
import { getUserBorrowHistory } from "../controllers/borrowController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/borrow", protect, borrowBook);
router.post("/return", protect, returnBook);
router.post("/renew", protect, renewBook);
router.get("/fine/:borrowId", protect, calculateFine);
router.get("/history", protect, getUserBorrowHistory);
router.get("/records", protect, authorize("librarian"), getAllBorrowRecords);

export default router;

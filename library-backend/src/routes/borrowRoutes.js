import express from "express";
import { borrowBook, getAllBorrowRecords, returnBook, renewBook, calculateFine } from "../controllers/borrowController.js";
import { getUserBorrowHistory } from "../controllers/borrowController.js";
const router = express.Router();

router.post("/borrow", borrowBook);
router.post("/return", returnBook);
router.post("/renew", renewBook);
router.get("/fine/:borrowId", calculateFine);
router.get("/history", getUserBorrowHistory);
router.get("/records", getAllBorrowRecords);

export default router;

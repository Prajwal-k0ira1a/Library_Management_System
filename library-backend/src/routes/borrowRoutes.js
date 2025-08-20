import express from "express";
import { borrowBook, getAllBorrowRecords, returnBook, renewBook, calculateFine } from "../controllers/borrowController.js";
import { getUserBorrowHistory } from "../controllers/borrowController.js";

import { checkRole, authenticateToken } from "../middleware/auth.js";
    

const router = express.Router();

router.post("/borrow", [checkRole("librarian"), authenticateToken], borrowBook);
router.post("/return", [checkRole("librarian"), authenticateToken], returnBook);
router.post("/renew", [checkRole("librarian"), authenticateToken], renewBook);
router.get("/fine/:borrowId", [checkRole("librarian"), authenticateToken], calculateFine);
router.get("/history", [checkRole("librarian"), authenticateToken], getUserBorrowHistory);
router.get("/records", [checkRole("librarian"), authenticateToken], getAllBorrowRecords);

export default router;

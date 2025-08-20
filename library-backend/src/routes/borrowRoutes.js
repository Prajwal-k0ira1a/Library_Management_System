import express from "express";
import {
  borrowBook,
  getAllBorrowRecords,
  returnBook,
  renewBook,
  calculateFine,
  getUserBorrowHistory,
} from "../controllers/borrowController.js";

import { checkRole, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/borrow", [authenticateToken, checkRole("librarian")], borrowBook);
router.post("/return", [authenticateToken, checkRole("librarian")], returnBook);
router.post("/renew", [authenticateToken, checkRole("librarian")], renewBook);
router.get(
  "/fine/:borrowId",
  [authenticateToken, checkRole("librarian")],
  calculateFine
);
router.get(
  "/history",
  [authenticateToken, checkRole("librarian")],
  getUserBorrowHistory
);
router.get(
  "/records",
  [authenticateToken, checkRole("librarian")],
  getAllBorrowRecords
);

export default router;

import express from "express";
import {
  requestBorrowBook,
  handleBorrowRequest,
  getMyBorrowRequests,
  getPendingBorrowRequests,
  getPendingReturns,
  getAllBorrows,
  requestReturn,
  approveReturn,
  getMonthlyBorrowStats,
} from "../controllers/borrowController.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";

const router = express.Router();

//   Borrower Routes
router.post("/request-borrow", authenticateToken, requestBorrowBook);
router.get("/my", authenticateToken, getMyBorrowRequests);
router.post("/return/:borrowId", authenticateToken, requestReturn);

// Librarian Routes
router.get(
  "/pending",
  [authenticateToken, checkRole("librarian")],
  getPendingBorrowRequests
);
router.get(
  "/pending-returns",
  [authenticateToken, checkRole("librarian")],
  getPendingReturns
);
router.put(
  "/approve-request/:requestId",
  [authenticateToken, checkRole("librarian")],
  handleBorrowRequest
);
router.put(
  "/approve-return/:borrowId",
  [authenticateToken, checkRole("librarian")],
  approveReturn
);
router.get(
  "/monthly-borrow-stats",
  [authenticateToken, checkRole("librarian")],
  getMonthlyBorrowStats
);
// Admin Routes
router.get(
  "/all",
  [authenticateToken, checkRole("librarian")],
  getAllBorrows
);

export default router;
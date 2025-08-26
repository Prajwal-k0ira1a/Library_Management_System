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
} from "../controllers/borrowController.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";
const router = express.Router();
router.post("/request-borrow", authenticateToken, requestBorrowBook);
router.get("/my", authenticateToken, getMyBorrowRequests);
router.post("/return/:borrowId", authenticateToken, requestReturn);

// Librarian
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
  "/:requestId",
  [authenticateToken, checkRole("librarian")],
  handleBorrowRequest
);
router.put(
  "/approve-return/:borrowId",
  [authenticateToken, checkRole("librarian")],
  approveReturn
);

// Admin: list all borrows
router.get("/all", [authenticateToken, checkRole("librarian")], getAllBorrows);
export default router;

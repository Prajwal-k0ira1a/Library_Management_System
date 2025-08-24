import express from "express";

import {
  requestBorrowBook,
  handleBorrowRequest,
  getMyBorrowRequests,
  getPendingBorrowRequests,
  requestReturn,
  approveReturn,
} from "../controllers/borrowController.js";
import { authenticateToken, checkRole } from "../middleware/auth.js";
const router = express.Router();
router.post("/", authenticateToken, requestBorrowBook);
router.get("/my", authenticateToken, getMyBorrowRequests);
router.post("/return/:borrowId", authenticateToken, requestReturn);

// Librarian
router.get(
  "/pending",
  [authenticateToken, checkRole("librarian")],
  getPendingBorrowRequests
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
export default router;

import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailTemplate.js";

// Borrower creates request
export const requestBorrowBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.body;

    // check if already pending
    const existing = await Borrow.findOne({
      userId,
      bookId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ status: false, message: "Already requested this book" });
    }

    const request = new Borrow({ userId, bookId, status: "pending" });
    await request.save();

    res
      .status(201)
      .json({ status: true, message: "Borrow request created", request });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Librarian approves/rejects
export const handleBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, action } = req.body; // support either status or action

    const desired =
      status ||
      (action === "approve"
        ? "approved"
        : action === "reject"
        ? "rejected"
        : undefined);

    const request = await Borrow.findById(requestId)
      .populate("bookId")
      .populate("userId");

    if (!request)
      return res
        .status(404)
        .json({ status: false, message: "Request not found" });

    if (desired === "approved") {
      const book = await Book.findById(request.bookId._id);
      if (!book || book.available < 1) {
        return res
          .status(400)
          .json({ status: false, message: "Book not available" });
      }

      // Create Borrow record
      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 15);

      // Update book availability
      book.available -= 1;
      await book.save();

      // Update request
      request.status = "approved";
      request.approvedDate = now;
      request.borrowDate = now;
      request.dueDate = dueDate;
      await request.save();

      sendEmail(
        request.userId.email,
        "bookBorrowed",
        request.userId.name,
        book.title,
        dueDate.toLocaleDateString()
      );

      return res.json({
        status: true,
        message: "Request approved, book borrowed",
        borrow: request,
      });
    } else if (desired === "rejected") {
      request.status = "rejected";
      await request.save();

      // Send email notification for rejection
      sendEmail(
        request.userId.email,
        "bookRejected",
        request.userId.name,
        request.bookId.title
      );

      return res.json({ status: true, message: "Request rejected" });
    } else {
      return res.status(400).json({ status: false, message: "Invalid action" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Borrower views their requests
export const getMyBorrowRequests = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const requests = await Borrow.find({ userId })
      .populate("bookId")
      .sort({ requestDate: -1 });

    res.status(200).json({ status: true, data: requests });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Librarian views all pending requests
export const getPendingBorrowRequests = async (req, res) => {
  try {
    const requests = await Borrow.find({ status: "pending" })
      .populate("bookId")
      .populate("userId", "name email");

    res.json({ status: true, data: requests });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Get pending returns for librarian
export const getPendingReturns = async (req, res) => {
  try {
    const pendingReturns = await Borrow.find({ status: "pending_return" })
      .populate("bookId")
      .populate("userId", "name email")
      .sort({ requestDate: -1 });

    res.json({ status: true, data: pendingReturns });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Get all borrows for librarian (with optional status filter)
export const getAllBorrows = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const borrows = await Borrow.find(query)
      .populate("bookId")
      .populate("userId", "name email")
      .sort({ requestDate: -1 });

    res.json({ status: true, data: borrows });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrowRecord = await Borrow.findById(borrowId);
    if (!borrowRecord)
      return res
        .status(404)
        .json({ status: false, message: "Record not found" });

    if (borrowRecord.status !== "approved") {
      return res
        .status(400)
        .json({ status: false, message: "Book is not currently borrowed" });
    }

    borrowRecord.status = "pending_return";
    await borrowRecord.save();

    res.json({
      status: true,
      message: "Return request sent to librarian",
      data: borrowRecord,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Librarian approves return
export const approveReturn = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrowRecord = await Borrow.findById(borrowId).populate("bookId");
    if (!borrowRecord)
      return res
        .status(404)
        .json({ status: false, message: "Record not found" });

    if (borrowRecord.status !== "pending_return") {
      return res
        .status(400)
        .json({ status: false, message: "No pending return request" });
    }

    borrowRecord.returnDate = new Date();
    borrowRecord.status = "returned";

    // Fine calculation
    if (borrowRecord.returnDate > borrowRecord.dueDate) {
      const daysLate = Math.ceil(
        (borrowRecord.returnDate - borrowRecord.dueDate) / (1000 * 60 * 60 * 24)
      );
      borrowRecord.fine = daysLate * 10; // e.g., Rs.10/day
    }

    await borrowRecord.save();

    // Update book stock
    const book = await Book.findById(borrowRecord.bookId._id);
    book.available += 1;
    await book.save();

    res.json({
      status: true,
      message: "Return approved successfully",
      data: borrowRecord,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

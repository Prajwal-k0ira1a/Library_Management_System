import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailTemplate.js";

// Borrower creates request
export const requestBorrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // check if already pending
    const existing = await BorrowRequest.findOne({
      userId,
      bookId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ status: false, message: "Already requested this book" });
    }

    const request = new BorrowRequest({ userId, bookId });
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
    const { status } = req.body; // "approved" or "rejected"

    const request = await BorrowRequest.findById(requestId)
      .populate("bookId")
      .populate("userId");

    if (!request)
      return res
        .status(404)
        .json({ status: false, message: "Request not found" });

    if (status === "approved") {
      const book = await Book.findById(request.bookId._id);
      if (!book || book.available < 1) {
        return res
          .status(400)
          .json({ status: false, message: "Book not available" });
      }

      // Create Borrow record
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);

      const borrow = new Borrow({
        userId: request.userId._id,
        bookId: request.bookId._id,
        dueDate,
      });
      await borrow.save();

      // Update book availability
      book.available -= 1;
      await book.save();

      // Update request
      request.status = "approved";
      request.approvedDate = Date.now();
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
        borrow,
      });
    } else {
      request.status = "rejected";
      await request.save();
      return res.json({ status: true, message: "Request rejected" });
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
    const requests = await BorrowRequest.find({ userId })
      .populate("bookId")
      .sort({ requestDate: -1 });

    res.json({ status: true, data: requests });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

// Librarian views all pending requests
export const getPendingBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ status: "pending" })
      .populate("bookId")
      .populate("userId", "name email");

    res.json({ status: true, data: requests });
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
      return res.status(404).json({ message: "Record not found" });

    if (borrowRecord.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Book is not currently borrowed" });
    }

    borrowRecord.status = "pending_return";
    await borrowRecord.save();

    res.json({
      message: "Return request sent to librarian",
      data: borrowRecord,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Librarian approves return
export const approveReturn = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrowRecord = await Borrow.findById(borrowId).populate("bookId");
    if (!borrowRecord)
      return res.status(404).json({ message: "Record not found" });

    if (borrowRecord.status !== "pending_return") {
      return res.status(400).json({ message: "No pending return request" });
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

    res.json({ message: "Return approved successfully", data: borrowRecord });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
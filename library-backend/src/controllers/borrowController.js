import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { sendEmail } from '../utils/emailTemplate.js';

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return res.status(400).json({ status: false, message: "No available copies" });
    }

    // Check if user already has this book borrowed (not returned)
    const existingBorrow = await Borrow.findOne({ userId, bookId, returnDate: null });
    if (existingBorrow) {
      return res.status(400).json({
        status: false,
        message: "You already have this book borrowed"
      });
    }

    // Check total number of books currently borrowed by user (not returned)
    const currentBorrows = await Borrow.countDocuments({
      userId,
      returnDate: null
    });
    if (currentBorrows >= 2) {
      return res.status(400).json({
        status: false,
        message: "You can only borrow a maximum of 2 books at a time"
      });
    }

    // Create borrow record with 15-day due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    const borrow = new Borrow({
      userId,
      bookId,
      dueDate
    });
    await borrow.save();

    // Decrease available count
    book.available -= 1;
    await book.save();

    const user = await User.findById(userId);
    const dueDateStr = new Date(borrow.dueDate).toLocaleDateString();
    sendEmail(user.email, 'bookBorrowed', user.name, book.title, dueDateStr);

    res.status(201).json({ status: true, message: "Book borrowed", borrow });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};


export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId).populate("bookId");
    if (!borrow || borrow.returnDate) {
      return res.status(400).json({ status: false, message: "Invalid or already returned" });
    }

    // Calculate final fine if overdue
    const currentDate = new Date();
    const dueDate = new Date(borrow.dueDate);

    if (currentDate > dueDate) {
      const overdueDays = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      borrow.fine = 5 + (overdueDays - 1) * 5; // Rs 5 initial + Rs 5 per additional day
    }

    borrow.returnDate = currentDate;
    await borrow.save();

    // Increase book availability
    const book = await Book.findById(borrow.bookId._id);
    book.available += 1;
    await book.save();

    const user = await User.findById(borrow.userId);
    sendEmail(user.email, 'bookReturned', user.name, borrow.bookId.title, borrow.fine || 0);

    res.status(200).json({
      status: true,
      message: "Book returned",
      borrow,
      fine: borrow.fine
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const renewBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow || borrow.returnDate) {
      return res.status(400).json({
        status: false,
        message: "Invalid borrow record or book already returned"
      });
    }

    if (borrow.renewalCount >= borrow.maxRenewals) {
      return res.status(400).json({
        status: false,
        message: "Maximum renewals exceeded"
      });
    }

    // Reset due date to 15 days from now
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 15);

    borrow.dueDate = newDueDate;
    borrow.renewalCount += 1;
    borrow.fine = 0; // Reset any existing fine
    await borrow.save();

    res.status(200).json({
      status: true,
      message: "Book renewed successfully",
      borrow,
      newDueDate
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const calculateFine = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow || borrow.returnDate) {
      return res.status(400).json({
        status: false,
        message: "Invalid borrow record or book already returned"
      });
    }

    const currentDate = new Date();
    const dueDate = new Date(borrow.dueDate);

    if (currentDate > dueDate) {
      const overdueDays = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      const fineAmount = 5 + (overdueDays - 1) * 5; // Rs 5 initial + Rs 5 per additional day

      borrow.fine = fineAmount;
      await borrow.save();

      const user = await User.findById(borrow.userId);
      sendEmail(user.email, 'bookOverdue', user.name, borrow.bookId.title, fineAmount);

      res.status(200).json({
        status: true,
        message: "Fine calculated",
        overdueDays,
        fine: fineAmount
      });
    } else {
      res.status(200).json({
        status: true,
        message: "No fine - book not overdue",
        fine: 0
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const getUserBorrowHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const borrowedBooks = await Borrow.find({ userId })
      .populate({
        path: "userId",
        select: "name",
      })
      .populate({ path: "bookId", select: "name title author isbn" });

    if (!borrowedBooks || borrowedBooks.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Your borrowing history is empty",
      });
    }

    res.status(200).json({
      status: true,
      message: "Your borrowing history loaded successfully",
      data: borrowedBooks,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to load borrowing history",
      error: error.message,
    });
  }
};

export const getAllBorrowRecords = async (req, res) => {
  try {
    let borrowRecords;

    if (req.params.id) {
      const userId = req.params.id;
      borrowRecords = await Borrow.find({ userId }).populate("bookId");

      if (!borrowRecords || borrowRecords.length === 0) {
        return res.status(404).json({
          status: false,
          message: "This user has no borrowing records",
        });
      }

      return res.status(200).json({
        status: true,
        message: `Borrowing records for user ${userId} retrieved successfully`,
        data: borrowRecords,
      });
    }

    borrowRecords = await Borrow.find()
      .populate("bookId")
      .populate([{ path: "userId", select: "name" }]);

    if (!borrowRecords || borrowRecords.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No borrowing records found in the system",
      });
    }

    res.status(200).json({
      status: true,
      message: "All borrowing records retrieved successfully",
      data: borrowRecords,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve borrowing records",
      error: error.message,
    });
  }
};

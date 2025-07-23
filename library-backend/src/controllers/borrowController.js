import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return res.status(400).json({ status: false, message: "No available copies" });
    }
    // Create borrow record
    const borrow = new Borrow({ userId, bookId });
    await borrow.save();

    // Decrease available count
    book.available -= 1;
    await book.save();

    res.status(201).json({ status:true, message: "Book borrowed", borrow });
  } catch (err) {
    res.status(500).json({ status:false, message: "Server error", error: err.message });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId).populate("bookId");
    if (!borrow || borrow.returnDate) {
      return res.status(400).json({ status:false, message: "Invalid or already returned" });
    }

    borrow.returnDate = new Date();
    await borrow.save();

    // Increase book availability
    const book = await Book.findById(borrow.bookId._id);
    book.available += 1;
    await book.save();

    res.status(200).json({ message: "Book returned", borrow });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
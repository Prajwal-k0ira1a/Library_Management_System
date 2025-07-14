import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return res.status(400).json({ message: "No available copies" });
    }

    // Create borrow record
    const borrow = new Borrow({ userId, bookId });
    await borrow.save();

    // Decrease available count
    book.available -= 1;
    await book.save();

    res.status(201).json({ message: "Book borrowed", borrow });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId).populate("bookId");
    if (!borrow || borrow.returnDate) {
      return res.status(400).json({ message: "Invalid or already returned" });
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

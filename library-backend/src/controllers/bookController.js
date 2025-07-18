import Book from "../models/Book.js";

// Create a new book (Librarian only)
export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);

    const existing = await Book.findOne({ isbn });
    if (existing) return res.status(400).json({ message: "Book already exists (ISBN duplicate)" });

    await book.save();
    res.status(201).json({ message: "Book created successfully", book });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated", book: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

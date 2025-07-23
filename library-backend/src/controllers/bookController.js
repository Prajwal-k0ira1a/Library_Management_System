import Book from "../models/Book.js";

// Create a new book (Librarian only)
export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);

    const existing = await Book.findOne({ isbn });
    if (existing) return res.status(400).json({ status: false, message: "Book already exists (ISBN duplicate)" });

    await book.save();
    res.status(201).json({ status: true, message: "Book created successfully", book });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    if (!books.length || !books) return res.status(404).json({ status: false, message: "No books found" });
    res.status(200).json({ status: true, data: books });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(400).json({ status: false, message: "Book not found", error: "No book found with this ID" });

    res.status(201).json({
      status: true, message: `Book with id ${req.params.id} retrieved successfully`, data: book,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Error occured", error: error.message, });
  }
};
// Update a book
// Update a book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle quantity updates - ensure it's a positive number
    if (updateData.quantity !== undefined) {
      if (updateData.quantity < 0) {
        return res.status(400).json({
          message: "Invalid quantity",
          error: "Quantity cannot be negative"
        });
      }
      updateData.quantity = parseInt(updateData.quantity);
    }

    // Handle availability updates - ensure it's not greater than quantity
    if (updateData.available !== undefined) {
      if (updateData.available < 0) {
        return res.status(400).json({
          message: "Invalid availability",
          error: "Available books cannot be negative"
        });
      }
      updateData.available = parseInt(updateData.available);
    }

    // If both quantity and available are being updated, validate the relationship
    if (updateData.quantity !== undefined && updateData.available !== undefined) {
      if (updateData.available > updateData.quantity) {
        return res.status(400).json({
          message: "Invalid book counts",
          error: "Available books cannot exceed total quantity"
        });
      }
    }

    // If only available is being updated, check against existing quantity
    if (updateData.available !== undefined && updateData.quantity === undefined) {
      const existingBook = await Book.findById(id);
      if (existingBook && updateData.available > existingBook.quantity) {
        return res.status(400).json({
          message: "Invalid availability",
          error: `Available books (${updateData.available}) cannot exceed total quantity (${existingBook.quantity})`
        });
      }
    }

    // Find and update the book
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });

    // Check if book exists
    if (!updatedBook) {
      return res.status(404).json({ 
        message: "Book not found",
        bookId: id 
      });
    }

    // Log what was updated
    const updatedFields = Object.keys(updateData);
    console.log(`Book updated: ${updatedBook.title} - Fields: ${updatedFields.join(', ')}`);

    // Return success response
    res.status(200).json({ 
      message: "Book updated successfully", 
      book: {
        id: updatedBook._id,
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        quantity: updatedBook.quantity,
        available: updatedBook.available
      },
      updatedFields: updatedFields,
      updatedAt: new Date()
    });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      message: "Server error during update", 
      error: err.message 
    });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the book
    const deletedBook = await Book.findByIdAndDelete(id);

    // Check if book exists
    if (!deletedBook) {
      return res.status(404).json({ 
        message: "Book not found",
        bookId: id 
      });
    }

    // Log the deletion
    console.log(`Book deleted: "${deletedBook.title}" by ${deletedBook.author} (ISBN: ${deletedBook.isbn})`);

    // Return success response
    res.status(200).json({ 
      message: "Book deleted successfully",
      deletedBook: {
        id: deletedBook._id,
        title: deletedBook.title,
        author: deletedBook.author,
        isbn: deletedBook.isbn,
        quantity: deletedBook.quantity,
        available: deletedBook.available
      },
      deletedAt: new Date()
    });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      message: "Server error during deletion", 
      error: err.message 
    });
  }
};
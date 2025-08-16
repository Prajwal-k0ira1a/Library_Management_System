import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookImage: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  available: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;

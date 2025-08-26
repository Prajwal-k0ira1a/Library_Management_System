import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookImages: [{ type: String, required: true }], // <-- Array of strings
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  available: { type: Number, required: true },
  description: { type: String, required: true },  
  genre: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "Borrowed"],
    default: "Available",
  },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;

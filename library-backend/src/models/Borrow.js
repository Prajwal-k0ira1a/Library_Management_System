import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  requestDate: { type: Date, default: Date.now },
  borrowDate: { type: Date },
  dueDate: { type: Date },
  returnDate: { type: Date },
  approvedDate: { type: Date },
  fine: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "pending_return", "returned"],
    default: "pending",
  },
});

export default mongoose.model("Borrow", borrowSchema);

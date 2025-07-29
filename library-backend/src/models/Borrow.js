import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  fine: { type: Number, default: 0 },
  renewalCount: { type: Number, default: 0 },
  maxRenewals: { type: Number, default: 10 }
});

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;

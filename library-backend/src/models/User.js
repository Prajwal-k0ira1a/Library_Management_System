import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profileImage:{type:String ,default:" "},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, minlength:10, required: true },
  role: { type: String, enum: ["borrower", "librarian"], default: "borrower" },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model("User", userSchema);

export default User;

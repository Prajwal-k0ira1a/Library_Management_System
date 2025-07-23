import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
    
export const seedAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "librarian",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
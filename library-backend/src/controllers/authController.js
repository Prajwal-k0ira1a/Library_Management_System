import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from '../utils/emailTemplate.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ status: false, message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data object
    const userData = { name, email, password: hashedPassword, role };
    
    // If there's a file uploaded, add the Cloudinary URL
    if (req.file) {
      userData.profileImage = req.file.path;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Send welcome email with original password
    sendEmail(user.email, 'welcome', user.name, user.email, password);

    res.status(201).json({ status: true, message: "User registered successfully", data: user });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ status: false, message: "Invalid email or password" });

    // Use same secret as auth middleware
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      status: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },token
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ status: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};

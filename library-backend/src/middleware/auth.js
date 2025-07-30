import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from "dotenv"
import rateLimit from "express-rate-limit";
dotenv.config();
const SECRET = process.env.JWT_SECRET || "fallback-secret-key";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Too many failed login attempts. Please try again after 3 hours.",
    });
  },
})

// Add validation
if (!process.env.JWT_SECRET) {
  console.warn(" JWT_SECRET not found in environment variables!");
}

// Helper function to decode token and get user
const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, SECRET);
  if (!decoded.userId) throw new Error("Token missing userId");

  const user = await User.findOne({ _id: decoded.userId }).select("-password");
  if (!user) throw new Error("User not found");

  return user;
};

// Role-based middleware
function checkRole(...roles) {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ error: "No token in cookies" });

      const user = await getUserFromToken(token);

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: `Role '${user.role}' not authorized` });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("checkRole error:", err);
      res.status(401).json({ error: err.message });
    }
  };
}

// Basic authentication
async function authenticateToken(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No token in cookies" });

    const user = await getUserFromToken(token);
    req.user = user;
    next();
  } catch (err) {
    console.error("authenticateToken error:", err);
    res.status(401).json({ error: err.message });
  }
}

export { authenticateToken, checkRole,limiter };
export const protect = authenticateToken;
export const authorize = checkRole;



import express from "express";
import authRouter from "./authRoutes.js";
import bookRouter from "./bookRoutes.js";
import borrowRouter from "./borrowRoutes.js";
import userRouter from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/borrow", borrowRouter);
router.use("/users", userRouter);

export default router;

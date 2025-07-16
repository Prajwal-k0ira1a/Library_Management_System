import express from "express";
import authRouter from "./authRoutes.js";
import bookRouter from "./bookRoutes.js";
import borrowRouter from "./borrowRoutes.js"

const router = express.Router();

router.use("/auth", authRouter);
router.use("/book", bookRouter);
router.use("/borrow", borrowRouter)

export default router;
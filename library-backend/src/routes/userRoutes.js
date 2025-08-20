import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.js';
import { uploadUserImage } from '../config/cloudinary.js';
import { checkRole, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/all', [authenticateToken, checkRole("librarian")], getUsers);
router.get('/get/:id', [authenticateToken, checkRole("librarian")], getUserById);
router.delete('/delete/:id', [authenticateToken, checkRole("librarian")], deleteUser);
router.put("/update/:id", uploadUserImage.single("profileImage"), updateUser);

export default router;


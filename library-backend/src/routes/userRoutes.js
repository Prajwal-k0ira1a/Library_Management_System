import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize("librarian"), getUsers);
router.get('/:id', protect, authorize("librarian"), getUserById);
router.delete('/:id', protect, authorize("librarian"), deleteUser);
router.put('/:id', protect, authorize("librarian"), updateUser);

export default router;


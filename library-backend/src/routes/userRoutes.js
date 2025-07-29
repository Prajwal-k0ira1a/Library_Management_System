import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Delete user
router.delete('/:id', deleteUser);

// Update user
router.put('/:id', updateUser);

export default router;

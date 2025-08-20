import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.js';

import { checkRole, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/all', [checkRole("librarian"), authenticateToken], getUsers);
router.get('/:id', [checkRole("librarian"), authenticateToken], getUserById);
router.delete('/:id', [checkRole("librarian"), authenticateToken], deleteUser);
router.put('/:id', [checkRole("librarian"), authenticateToken], updateUser);

export default router;


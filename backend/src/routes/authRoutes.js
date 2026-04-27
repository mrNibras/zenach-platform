import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/admins').get(protect, admin, getAdmins).post(protect, admin, createAdmin);
router.route('/admins/:id').put(protect, admin, updateAdmin).delete(protect, admin, deleteAdmin);

export default router;

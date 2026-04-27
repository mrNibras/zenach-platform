import express from 'express';
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.route('/')
  .get(protect, getMyCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

export default router;

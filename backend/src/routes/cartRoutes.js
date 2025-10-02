// backend/src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (support both guest and authenticated users)
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/items/:itemId', cartController.removeCartItem);
router.delete('/clear', cartController.clearCart);

// Protected route (authenticated users only)
router.post('/merge', protect, cartController.mergeCart);

module.exports = router;
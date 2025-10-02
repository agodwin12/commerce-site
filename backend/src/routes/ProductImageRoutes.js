const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams to get productId
const productImageController = require('../controllers/productImageController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

// Upload product images
router.post('/', protect, admin, uploadProductImages, productImageController.addProductImage);

// Delete product image
router.delete('/:imageId', protect, admin, productImageController.deleteProductImage);

module.exports = router;
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadCategoryImage } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/main', categoryController.getMainCategories);
router.get('/:identifier', categoryController.getCategoryById);

// IMPORTANT: Middleware order matters!
router.post(
    '/',
    protect,           // 1. Check authentication
    admin,             // 2. Check admin role
    uploadCategoryImage, // 3. Handle file upload
    categoryController.createCategory  // 4. Process request
);

router.put(
    '/:id',
    protect,
    admin,
    uploadCategoryImage,
    categoryController.updateCategory
);

router.delete('/:id', protect, admin, categoryController.deleteCategory);
router.patch('/:id/toggle-active', protect, admin, categoryController.toggleCategoryStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const productController = require('../controllers/productController');
const productImageController = require('../controllers/productImageController');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const productId = req.params.productId;
        const uploadDir = path.join(__dirname, '../../uploads/products', String(productId));

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Product routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:identifier', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/toggle-active', productController.toggleProductStatus);
router.patch('/:id/stock', productController.updateStock);

// Product image routes
router.get('/:productId/images', productImageController.getProductImages);
router.post('/:productId/images', upload.single('image'), productImageController.addProductImage);
router.put('/:productId/images/:imageId', productImageController.updateProductImage);
router.delete('/:productId/images/:imageId', productImageController.deleteProductImage);
router.patch('/:productId/images/:imageId/set-primary', productImageController.setPrimaryImage);

module.exports = router;
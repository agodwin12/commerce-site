const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const categoryUploadsDir = path.join(uploadsDir, 'categories');
const productUploadsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(categoryUploadsDir)) {
    fs.mkdirSync(categoryUploadsDir, { recursive: true });
}
if (!fs.existsSync(productUploadsDir)) {
    fs.mkdirSync(productUploadsDir, { recursive: true });
}

console.log('📁 Uploads dir exists:', fs.existsSync(uploadsDir));
console.log('📁 Categories dir exists:', fs.existsSync(categoryUploadsDir));
console.log('📁 Products dir exists:', fs.existsSync(productUploadsDir));

// Storage configuration for categories
const categoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, categoryUploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage configuration for products
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, productUploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed'), false);
    }
};

// Category upload middleware
const uploadCategory = multer({
    storage: categoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Product upload middleware (multiple images)
const uploadProduct = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Wrapper to handle multer errors for categories
const uploadCategoryImage = (req, res, next) => {
    uploadCategory.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

// Wrapper to handle multer errors for products (up to 5 images)
const uploadProductImages = (req, res, next) => {
    uploadProduct.array('images', 5)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

module.exports = {
    uploadCategoryImage,
    uploadProductImages
};
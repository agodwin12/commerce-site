// backend/src/controllers/productImageController.js
const ProductImage = require('../models/ProductImage');
const Product = require('../models/Product');
const path = require('path');

// @desc    Get all images for a product
// @route   GET /api/products/:productId/images
// @access  Public
exports.getProductImages = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const images = await ProductImage.findAll({
            where: { product_id: productId },
            order: [
                ['is_primary', 'DESC'],
                ['display_order', 'ASC']
            ]
        });

        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });

    } catch (error) {
        console.error('Get Product Images Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product images'
        });
    }
};

// @desc    Add image to product
// @route   POST /api/products/:productId/images
// @access  Private/Admin
exports.addProductImage = async (req, res) => {
    try {
        const { productId } = req.params;
        // SAFE destructuring (req.body may be undefined for bad/missing parsers)
        const body = req.body || {};
        let { image_url, is_primary, display_order } = body;

        // If file uploaded via multipart/form-data, build image_url from file path
        if (req.file) {
            // Create a web-friendly path like: /uploads/products/<productId>/<file>
            const rel = path
                .join('/uploads', 'products', String(productId), req.file.filename)
                .replace(/\\/g, '/');
            // Optionally serve absolute URL:
            image_url = `${req.protocol}://${req.get('host')}${rel}`;
        }

        // Validation
        if (!image_url) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required (send JSON { image_url } or upload file in field "image").'
            });
        }

        // Product must exist
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // If primary, unset others
        if (is_primary === true || is_primary === 'true') {
            await ProductImage.update({ is_primary: false }, { where: { product_id: productId } });
            is_primary = true;
        } else {
            is_primary = false;
        }

        const img = await ProductImage.create({
            product_id: productId,
            image_url,
            is_primary,
            display_order: Number.isFinite(+display_order) ? +display_order : 0
        });

        return res.status(201).json({
            success: true,
            message: 'Product image added successfully',
            data: img
        });
    } catch (error) {
        console.error('Add Product Image Error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        return res.status(500).json({ success: false, message: 'Error adding product image' });
    }
};

// @desc    Update product image
// @route   PUT /api/products/:productId/images/:imageId
// @access  Private/Admin
exports.updateProductImage = async (req, res) => {
    try {
        const { productId, imageId } = req.params;
        const { image_url, is_primary, display_order } = req.body;

        const productImage = await ProductImage.findOne({
            where: {
                id: imageId,
                product_id: productId
            }
        });

        if (!productImage) {
            return res.status(404).json({
                success: false,
                message: 'Product image not found'
            });
        }

        // If this image is being set as primary, unset other primary images
        if (is_primary && !productImage.is_primary) {
            await ProductImage.update(
                { is_primary: false },
                { where: { product_id: productId } }
            );
        }

        // Update product image
        await productImage.update({
            image_url: image_url || productImage.image_url,
            is_primary: is_primary !== undefined ? is_primary : productImage.is_primary,
            display_order: display_order !== undefined ? display_order : productImage.display_order
        });

        res.status(200).json({
            success: true,
            message: 'Product image updated successfully',
            data: productImage
        });

    } catch (error) {
        console.error('Update Product Image Error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating product image'
        });
    }
};

// @desc    Delete product image
// @route   DELETE /api/products/:productId/images/:imageId
// @access  Private/Admin
exports.deleteProductImage = async (req, res) => {
    try {
        const { productId, imageId } = req.params;

        const productImage = await ProductImage.findOne({
            where: {
                id: imageId,
                product_id: productId
            }
        });

        if (!productImage) {
            return res.status(404).json({
                success: false,
                message: 'Product image not found'
            });
        }

        // If deleting primary image, set another image as primary
        if (productImage.is_primary) {
            const nextImage = await ProductImage.findOne({
                where: {
                    product_id: productId,
                    id: { [require('sequelize').Op.ne]: imageId }
                },
                order: [['display_order', 'ASC']]
            });

            if (nextImage) {
                await nextImage.update({ is_primary: true });
            }
        }

        await productImage.destroy();

        res.status(200).json({
            success: true,
            message: 'Product image deleted successfully'
        });

    } catch (error) {
        console.error('Delete Product Image Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product image'
        });
    }
};

// @desc    Set image as primary
// @route   PATCH /api/products/:productId/images/:imageId/set-primary
// @access  Private/Admin
exports.setPrimaryImage = async (req, res) => {
    try {
        const { productId, imageId } = req.params;

        const productImage = await ProductImage.findOne({
            where: {
                id: imageId,
                product_id: productId
            }
        });

        if (!productImage) {
            return res.status(404).json({
                success: false,
                message: 'Product image not found'
            });
        }

        // Unset all primary images for this product
        await ProductImage.update(
            { is_primary: false },
            { where: { product_id: productId } }
        );

        // Set this image as primary
        await productImage.update({ is_primary: true });

        res.status(200).json({
            success: true,
            message: 'Primary image set successfully',
            data: productImage
        });

    } catch (error) {
        console.error('Set Primary Image Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting primary image'
        });
    }
};
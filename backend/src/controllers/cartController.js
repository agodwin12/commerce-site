// backend/src/controllers/cartController.js
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');  // ← ADD THIS
const crypto = require('crypto');

// Helper function to get or create cart
const getOrCreateCart = async (userId, sessionId) => {
    let cart;

    if (userId) {
        // For authenticated users
        cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }
    } else {
        // For guest users
        cart = await Cart.findOne({ where: { session_id: sessionId } });
        if (!cart) {
            cart = await Cart.create({ session_id: sessionId });
        }
    }

    return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (supports guest and authenticated users)
exports.getCart = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const sessionId = req.headers['x-session-id'] || req.query.session_id;

        if (!userId && !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required for guest users'
            });
        }

        const cart = await getOrCreateCart(userId, sessionId);

        const cartItems = await CartItem.findAll({
            where: { cart_id: cart.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'stock_quantity', 'is_active'],
                    include: [  // ← ADD THIS ENTIRE BLOCK
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'image_url', 'is_primary']
                        }
                    ]
                }
            ]
        });

        // Calculate totals
        let subtotal = 0;
        const items = cartItems.map(item => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            subtotal += itemTotal;
            return {
                ...item.toJSON(),
                item_total: itemTotal.toFixed(2)
            };
        });

        res.status(200).json({
            success: true,
            data: {
                cart_id: cart.id,
                items,
                summary: {
                    subtotal: subtotal.toFixed(2),
                    items_count: items.length,
                    total_quantity: items.reduce((sum, item) => sum + item.quantity, 0)
                }
            }
        });

    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
};




// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public
exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const userId = req.user ? req.user.id : null;
        const sessionId = req.headers['x-session-id'] || req.body.session_id || crypto.randomUUID();

        // Validation
        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        // Check if product exists and is active
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.is_active) {
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        // Check stock availability
        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock_quantity} items available in stock`
            });
        }

        // Get or create cart
        const cart = await getOrCreateCart(userId, sessionId);

        // Check if product already exists in cart
        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                product_id
            }
        });

        if (cartItem) {
            // Update quantity if product already in cart
            const newQuantity = cartItem.quantity + quantity;

            if (product.stock_quantity < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more. Only ${product.stock_quantity} items available in stock`
                });
            }

            await cartItem.update({ quantity: newQuantity });
        } else {
            // Create new cart item
            cartItem = await CartItem.create({
                cart_id: cart.id,
                product_id,
                quantity,
                price: product.price
            });
        }

        // Fetch updated cart item with product details
        const updatedCartItem = await CartItem.findByPk(cartItem.id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price', 'stock_quantity'],
                    include: [  // ← ADD THIS
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'image_url', 'is_primary']
                        }
                    ]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Product added to cart successfully',
            session_id: sessionId,
            data: updatedCartItem
        });

    } catch (error) {
        console.error('Add to Cart Error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error adding product to cart'
        });
    }
};




// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Public
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity, session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Valid quantity is required'
            });
        }

        // Find the cart item
        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
                    as: 'cart',
                    where: { session_id: session_id }
                },
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Check stock availability
        if (quantity > cartItem.product.stock_quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${cartItem.product.stock_quantity} items available in stock`
            });
        }

        await cartItem.update({ quantity });

        res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data: cartItem
        });

    } catch (error) {
        console.error('Update Cart Item Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item'
        });
    }
};








// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Public
exports.removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { session_id } = req.query; // Get session_id from query params

        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        // Find the cart item
        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
                    as: 'cart',
                    where: { session_id: session_id }
                }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        await cartItem.destroy();

        res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error('Remove Cart Item Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart'
        });
    }
};





// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public
exports.clearCart = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const cart = await Cart.findOne({
            where: { session_id: session_id }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        await CartItem.destroy({
            where: { cart_id: cart.id }
        });

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully'
        });

    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart'
        });
    }
};
// @desc    Merge guest cart with user cart after login
// @route   POST /api/cart/merge
// @access  Private
exports.mergeCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        // Find guest cart
        const guestCart = await Cart.findOne({ where: { session_id } });
        if (!guestCart) {
            return res.status(404).json({
                success: false,
                message: 'Guest cart not found'
            });
        }

        // Get or create user cart
        let userCart = await Cart.findOne({ where: { user_id: userId } });
        if (!userCart) {
            userCart = await Cart.create({ user_id: userId });
        }

        // Get all items from guest cart
        const guestItems = await CartItem.findAll({ where: { cart_id: guestCart.id } });

        // Merge items
        for (const guestItem of guestItems) {
            const existingItem = await CartItem.findOne({
                where: {
                    cart_id: userCart.id,
                    product_id: guestItem.product_id
                }
            });

            if (existingItem) {
                // Update quantity if item exists
                await existingItem.update({
                    quantity: existingItem.quantity + guestItem.quantity
                });
            } else {
                // Create new item
                await CartItem.create({
                    cart_id: userCart.id,
                    product_id: guestItem.product_id,
                    quantity: guestItem.quantity,
                    price: guestItem.price
                });
            }
        }

        // Delete guest cart
        await guestCart.destroy();

        res.status(200).json({
            success: true,
            message: 'Cart merged successfully'
        });

    } catch (error) {
        console.error('Merge Cart Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error merging cart'
        });
    }
};
// backend/src/controllers/orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const {
            shipping_first_name,
            shipping_last_name,
            shipping_email,
            shipping_phone,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_postal_code,
            shipping_country,
            payment_method,
            notes
        } = req.body;

        // Validation
        if (!shipping_first_name || !shipping_last_name || !shipping_email ||
            !shipping_phone || !shipping_address || !shipping_city || !shipping_country) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Please provide all required shipping information'
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({
            where: { user_id: userId },
            transaction: t
        });

        if (!cart) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Get cart items with products
        const cartItems = await CartItem.findAll({
            where: { cart_id: cart.id },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ],
            transaction: t
        });

        if (cartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock and calculate totals
        let subtotal = 0;
        for (const item of cartItems) {
            if (!item.product.is_active) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Product "${item.product.name}" is no longer available`
                });
            }

            if (item.product.stock_quantity < item.quantity) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${item.product.name}". Only ${item.product.stock_quantity} available`
                });
            }

            subtotal += parseFloat(item.price) * item.quantity;
        }

        // Calculate shipping, tax, and total
        const shipping_cost = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping_cost + tax;

        // Create order
        const order = await Order.create({
            user_id: userId,
            status: 'pending',
            shipping_first_name,
            shipping_last_name,
            shipping_email,
            shipping_phone,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_postal_code,
            shipping_country,
            subtotal: subtotal.toFixed(2),
            shipping_cost: shipping_cost.toFixed(2),
            tax: tax.toFixed(2),
            discount: 0,
            total: total.toFixed(2),
            payment_method: payment_method || 'pending',
            payment_status: 'pending',
            notes
        }, { transaction: t });

        // Create order items and update product stock
        for (const item of cartItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                product_name: item.product.name,
                product_sku: item.product.sku,
                quantity: item.quantity,
                price: item.price,
                total: (parseFloat(item.price) * item.quantity).toFixed(2)
            }, { transaction: t });

            // Decrease product stock
            await item.product.decrement('stock_quantity', {
                by: item.quantity,
                transaction: t
            });
        }

        // Clear cart after order is created
        await CartItem.destroy({
            where: { cart_id: cart.id },
            transaction: t
        });

        await t.commit();

        // Fetch created order with items
        const createdOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: createdOrder
        });

    } catch (error) {
        await t.rollback();
        console.error('Create Order Error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items'
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / parseInt(limit)),
            data: orders
        });

    } catch (error) {
        console.error('Get All Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: orders } = await Order.findAndCountAll({
            where: { user_id: userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / parseInt(limit)),
            data: orders
        });

    } catch (error) {
        console.error('Get My Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const whereClause = { id };
        if (!isAdmin) {
            whereClause.user_id = userId;
        }

        const order = await Order.findOne({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'slug']
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order'
        });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid status'
            });
        }

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await order.update({ status });

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });

    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status'
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const whereClause = { id };
        if (!isAdmin) {
            whereClause.user_id = userId;
        }

        const order = await Order.findOne({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                }
            ],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Only allow cancellation if order is pending or processing
        if (!['pending', 'processing'].includes(order.status)) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.increment('stock_quantity', {
                by: item.quantity,
                where: { id: item.product_id },
                transaction: t
            });
        }

        // Update order status
        await order.update({ status: 'cancelled' }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });

    } catch (error) {
        await t.rollback();
        console.error('Cancel Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling order'
        });
    }
};
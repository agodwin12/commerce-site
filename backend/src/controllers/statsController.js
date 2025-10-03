const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // Get all counts and sums
        const [
            totalProducts,
            totalOrders,
            totalCategories,
            totalRevenue,
            pendingOrders,
            totalCustomers
        ] = await Promise.all([
            Product.count({ where: { is_active: true } }),
            Order.count(),
            Category.count(),
            Order.sum('total') || 0,
            Order.count({ where: { status: 'pending' } }),
            User.count({ where: { role: 'customer' } })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalCategories,
                totalRevenue: parseFloat(totalRevenue || 0),
                pendingOrders,
                totalCustomers
            }
        });

    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
};
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin only route
router.get('/', protect, admin, statsController.getDashboardStats);

module.exports = router;
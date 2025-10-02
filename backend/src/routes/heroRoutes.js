// backend/src/routes/heroRoutes.js
const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', heroController.getAllHeroImages);
router.get('/active', heroController.getActiveHeroImages);
router.get('/:id', heroController.getHeroImageById);

// Protected routes (Admin only)
router.post('/', protect, admin, heroController.createHeroImage);
router.put('/:id', protect, admin, heroController.updateHeroImage);
router.delete('/:id', protect, admin, heroController.deleteHeroImage);
router.patch('/:id/toggle-active', protect, admin, heroController.toggleHeroImageStatus);

module.exports = router;
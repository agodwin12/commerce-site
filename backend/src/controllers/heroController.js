// backend/src/controllers/heroController.js
const HeroImage = require('../models/HeroImage');

// @desc    Get all hero images
// @route   GET /api/hero
// @access  Public
exports.getAllHeroImages = async (req, res) => {
    try {
        const { active_only } = req.query;

        const whereClause = {};
        if (active_only === 'true') {
            whereClause.is_active = true;
        }

        const heroImages = await HeroImage.findAll({
            where: whereClause,
            order: [['display_order', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: heroImages.length,
            data: heroImages
        });

    } catch (error) {
        console.error('Get All Hero Images Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hero images'
        });
    }
};

// @desc    Get active hero images (for homepage)
// @route   GET /api/hero/active
// @access  Public
exports.getActiveHeroImages = async (req, res) => {
    try {
        const heroImages = await HeroImage.findAll({
            where: { is_active: true },
            order: [['display_order', 'ASC']],
            limit: 3 // Limit to 3 as per requirements
        });

        res.status(200).json({
            success: true,
            count: heroImages.length,
            data: heroImages
        });

    } catch (error) {
        console.error('Get Active Hero Images Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching active hero images'
        });
    }
};

// @desc    Get single hero image
// @route   GET /api/hero/:id
// @access  Public
exports.getHeroImageById = async (req, res) => {
    try {
        const { id } = req.params;

        const heroImage = await HeroImage.findByPk(id);

        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: 'Hero image not found'
            });
        }

        res.status(200).json({
            success: true,
            data: heroImage
        });

    } catch (error) {
        console.error('Get Hero Image Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hero image'
        });
    }
};

// @desc    Create hero image
// @route   POST /api/hero
// @access  Private/Admin
exports.createHeroImage = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            image_url,
            link_url,
            button_text,
            is_active,
            display_order
        } = req.body;

        // Validation
        if (!image_url) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        // Check if we already have 3 active hero images
        const activeCount = await HeroImage.count({ where: { is_active: true } });
        if (activeCount >= 3 && is_active) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 3 active hero images allowed. Please deactivate one first.'
            });
        }

        const heroImage = await HeroImage.create({
            title,
            subtitle,
            image_url,
            link_url,
            button_text,
            is_active: is_active !== undefined ? is_active : true,
            display_order: display_order || 0
        });

        res.status(201).json({
            success: true,
            message: 'Hero image created successfully',
            data: heroImage
        });

    } catch (error) {
        console.error('Create Hero Image Error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating hero image'
        });
    }
};

// @desc    Update hero image
// @route   PUT /api/hero/:id
// @access  Private/Admin
exports.updateHeroImage = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            subtitle,
            image_url,
            link_url,
            button_text,
            is_active,
            display_order
        } = req.body;

        const heroImage = await HeroImage.findByPk(id);

        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: 'Hero image not found'
            });
        }

        // Check if activating and we already have 3 active images
        if (is_active && !heroImage.is_active) {
            const activeCount = await HeroImage.count({ where: { is_active: true } });
            if (activeCount >= 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum 3 active hero images allowed. Please deactivate one first.'
                });
            }
        }

        await heroImage.update({
            title: title !== undefined ? title : heroImage.title,
            subtitle: subtitle !== undefined ? subtitle : heroImage.subtitle,
            image_url: image_url || heroImage.image_url,
            link_url: link_url !== undefined ? link_url : heroImage.link_url,
            button_text: button_text !== undefined ? button_text : heroImage.button_text,
            is_active: is_active !== undefined ? is_active : heroImage.is_active,
            display_order: display_order !== undefined ? display_order : heroImage.display_order
        });

        res.status(200).json({
            success: true,
            message: 'Hero image updated successfully',
            data: heroImage
        });

    } catch (error) {
        console.error('Update Hero Image Error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating hero image'
        });
    }
};

// @desc    Delete hero image
// @route   DELETE /api/hero/:id
// @access  Private/Admin
exports.deleteHeroImage = async (req, res) => {
    try {
        const { id } = req.params;

        const heroImage = await HeroImage.findByPk(id);

        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: 'Hero image not found'
            });
        }

        await heroImage.destroy();

        res.status(200).json({
            success: true,
            message: 'Hero image deleted successfully'
        });

    } catch (error) {
        console.error('Delete Hero Image Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting hero image'
        });
    }
};

// @desc    Toggle hero image active status
// @route   PATCH /api/hero/:id/toggle-active
// @access  Private/Admin
exports.toggleHeroImageStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const heroImage = await HeroImage.findByPk(id);

        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: 'Hero image not found'
            });
        }

        // Check if activating and we already have 3 active images
        if (!heroImage.is_active) {
            const activeCount = await HeroImage.count({ where: { is_active: true } });
            if (activeCount >= 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum 3 active hero images allowed. Please deactivate one first.'
                });
            }
        }

        await heroImage.update({
            is_active: !heroImage.is_active
        });

        res.status(200).json({
            success: true,
            message: `Hero image ${heroImage.is_active ? 'activated' : 'deactivated'} successfully`,
            data: heroImage
        });

    } catch (error) {
        console.error('Toggle Hero Image Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling hero image status'
        });
    }
};
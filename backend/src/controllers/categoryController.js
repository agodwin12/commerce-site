// backend/src/controllers/categoryController.js
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');









// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
    try {
        console.log('[GET] /api/categories - Query:', req.query);
        const { active_only } = req.query;

        const whereClause = {};
        if (active_only === 'true') {
            whereClause.is_active = true;
            console.log('Fetching only active categories');
        }

        const categories = await Category.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    where: active_only === 'true' ? { is_active: true } : {},
                    required: false
                },
                {
                    model: Category,
                    as: 'parent',
                    required: false
                }
            ],
            order: [
                ['display_order', 'ASC'],
                ['name', 'ASC']
            ]
        });

        console.log('Fetched categories count:', categories.length);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        console.error('Get All Categories Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
};

// @desc    Get main categories only (no parent)
// @route   GET /api/categories/main
// @access  Public
exports.getMainCategories = async (req, res) => {
    try {
        console.log('[GET] /api/categories/main');
        const categories = await Category.findAll({
            where: {
                parent_id: null,
                is_active: true
            },
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    where: { is_active: true },
                    required: false
                }
            ],
            order: [
                ['display_order', 'ASC'],
                ['name', 'ASC']
            ]
        });

        console.log('Fetched main categories count:', categories.length);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        console.error('Get Main Categories Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching main categories'
        });
    }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:identifier
// @access  Public
exports.getCategoryById = async (req, res) => {
    try {
        const { identifier } = req.params;
        console.log(`[GET] /api/categories/${identifier}`);

        const whereClause = isNaN(identifier)
            ? { slug: identifier }
            : { id: identifier };

        const category = await Category.findOne({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    where: { is_active: true },
                    required: false
                },
                {
                    model: Category,
                    as: 'parent',
                    required: false
                }
            ]
        });

        if (!category) {
            console.log('Category not found:', identifier);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        console.log('Fetched category:', category.name);

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {
        console.error('Get Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category'
        });
    }
};



// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    console.log('\n==========================================');
    console.log('📝 CREATE CATEGORY REQUEST RECEIVED');
    console.log('==========================================');

    try {
        // Log request details
        console.log('🔍 Request Details:');
        console.log('   - Content-Type:', req.headers['content-type']);
        console.log('   - Body:', JSON.stringify(req.body, null, 2));
        console.log('   - File Object:', req.file ? 'EXISTS' : 'NULL');

        if (req.file) {
            console.log('\n📸 File Upload Details:');
            console.log('   - Field Name:', req.file.fieldname);
            console.log('   - Original Name:', req.file.originalname);
            console.log('   - Mimetype:', req.file.mimetype);
            console.log('   - Size:', req.file.size, 'bytes');
            console.log('   - Destination:', req.file.destination);
            console.log('   - Filename:', req.file.filename);
            console.log('   - Full Path:', req.file.path);

            // Check if file actually exists on disk
            const fileExists = fs.existsSync(req.file.path);
            console.log('   - File exists on disk:', fileExists ? '✅ YES' : '❌ NO');

            if (fileExists) {
                const stats = fs.statSync(req.file.path);
                console.log('   - File size on disk:', stats.size, 'bytes');
                console.log('   - File permissions:', stats.mode.toString(8));
            }
        } else {
            console.log('\n⚠️ No file object found in request');
            console.log('   This means either:');
            console.log('   1. No file was uploaded from frontend');
            console.log('   2. Multer middleware didn\'t process the file');
            console.log('   3. File field name mismatch');
        }

        // Extract and validate data
        console.log('\n🔍 Extracting form data...');
        const { name, description, parent_id, is_active, display_order } = req.body;
        console.log('   - Name:', name || 'MISSING');
        console.log('   - Description:', description || 'empty');
        console.log('   - Parent ID:', parent_id || 'none');
        console.log('   - Is Active:', is_active !== undefined ? is_active : 'default (true)');
        console.log('   - Display Order:', display_order || 'default (0)');

        // Validation
        if (!name) {
            console.log('\n❌ Validation Failed: Category name is required');
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        console.log('✅ Validation passed');

        // Handle uploaded image
        let image_url = null;
        if (req.file) {
            image_url = '/uploads/categories/' + req.file.filename;
            console.log('\n🖼️ Processing image:');
            console.log('   - Generated URL:', image_url);
            console.log('   - Will be stored in database as:', image_url);
        } else {
            console.log('\n⚠️ No image to process - category will be created without image');
        }

        // Verify parent category if provided
        if (parent_id) {
            console.log('\n🔍 Verifying parent category:', parent_id);
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                console.log('❌ Parent category not found with ID:', parent_id);
                return res.status(404).json({
                    success: false,
                    message: 'Parent category not found'
                });
            }
            console.log('✅ Parent category found:', parentCategory.name);
        }

        // Create category object
        console.log('\n💾 Creating category in database...');
        const categoryData = {
            name,
            description: description || null,
            image_url,
            parent_id: parent_id || null,
            is_active: is_active !== undefined ? is_active : true,
            display_order: display_order || 0
        };
        console.log('   Category data:', JSON.stringify(categoryData, null, 2));

        const category = await Category.create(categoryData);
        console.log('✅ Category created successfully in database');
        console.log('   - ID:', category.id);
        console.log('   - Name:', category.name);
        console.log('   - Image URL in DB:', category.image_url || 'NULL');

        // Final verification
        if (req.file && image_url) {
            const finalCheck = fs.existsSync(req.file.path);
            console.log('\n🔍 Final file verification:');
            console.log('   - File still exists:', finalCheck ? '✅ YES' : '❌ NO');
            console.log('   - File path:', req.file.path);

            if (!finalCheck) {
                console.log('⚠️ WARNING: File was uploaded but no longer exists!');
            }
        }

        console.log('\n✅ SUCCESS: Category creation completed');
        console.log('==========================================\n');

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.log('\n❌ ERROR OCCURRED');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);

        // Delete uploaded file if category creation failed
        if (req.file) {
            const filePath = req.file.path;
            console.log('\n🗑️ Attempting to delete uploaded file due to error...');
            console.log('   - File path:', filePath);

            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log('   ✅ File deleted successfully');
                } catch (deleteError) {
                    console.log('   ❌ Failed to delete file:', deleteError.message);
                }
            } else {
                console.log('   ⚠️ File does not exist, nothing to delete');
            }
        }

        // Handle specific error types
        if (error.name === 'SequelizeValidationError') {
            console.log('❌ Sequelize Validation Error');
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('❌ Sequelize Unique Constraint Error');
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        console.log('==========================================\n');

        res.status(500).json({
            success: false,
            message: 'Error creating category'
        });
    }
};



// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[PUT] /api/categories/${id} - Body:`, req.body);

        const { name, description, parent_id, is_active, display_order } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            console.log('Category not found:', id);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (parent_id && parseInt(parent_id) === parseInt(id)) {
            console.log('Validation failed: category cannot be its own parent');
            return res.status(400).json({
                success: false,
                message: 'Category cannot be its own parent'
            });
        }

        if (parent_id && parent_id !== category.parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                console.log('Parent category not found:', parent_id);
                return res.status(404).json({
                    success: false,
                    message: 'Parent category not found'
                });
            }
        }

        let image_url = category.image_url;
        if (req.file) {
            if (category.image_url) {
                deleteOldImage(category.image_url);
            }
            image_url = '/uploads/categories/' + req.file.filename;
            console.log('Updated image to:', image_url);
        }

        await category.update({
            name: name || category.name,
            description: description !== undefined ? description : category.description,
            image_url: image_url,
            parent_id: parent_id !== undefined ? parent_id : category.parent_id,
            is_active: is_active !== undefined ? is_active : category.is_active,
            display_order: display_order !== undefined ? display_order : category.display_order
        });

        console.log('Category updated:', category.name);

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });

    } catch (error) {
        console.error('Update Category Error:', error);

        if (req.file) {
            const filePath = path.join(__dirname, '../../uploads/categories/', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('Deleted uploaded file due to update error:', filePath);
            }
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating category'
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[DELETE] /api/categories/${id}`);

        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'subcategories'
                }
            ]
        });

        if (!category) {
            console.log('Category not found:', id);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (category.subcategories && category.subcategories.length > 0) {
            console.log('Cannot delete category with subcategories:', id);
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
            });
        }

        await category.destroy();
        console.log('Category deleted:', id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category'
        });
    }
};

// @desc    Toggle category active status
// @route   PATCH /api/categories/:id/toggle-active
// @access  Private/Admin
exports.toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[PATCH] /api/categories/${id}/toggle-active`);

        const category = await Category.findByPk(id);

        if (!category) {
            console.log('Category not found:', id);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        await category.update({
            is_active: !category.is_active
        });

        console.log(`Category ${category.name} status toggled to:`, category.is_active);

        res.status(200).json({
            success: true,
            message: `Category ${category.is_active ? 'activated' : 'deactivated'} successfully`,
            data: category
        });

    } catch (error) {
        console.error('Toggle Category Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling category status'
        });
    }
};

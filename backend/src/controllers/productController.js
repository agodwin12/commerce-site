// backend/src/controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImage = require('../models/ProductImage');
const { Op } = require('sequelize');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    console.log('\n========== GET ALL PRODUCTS ==========');
    console.log('[GET] /api/products - Query:', req.query);

    try {
        const {
            category,
            featured,
            min_price,
            max_price,
            search,
            sort,
            page = 1,
            limit = 100
        } = req.query;

        console.log('Filters received:', {
            category,
            featured,
            min_price,
            max_price,
            search,
            sort,
            page,
            limit
        });

        // Build where clause
        const whereClause = {};

        // Filter by category
        if (category) {
            whereClause.category_id = category;
            console.log('Filtering by category:', category);
        }

        // Filter by featured
        if (featured === 'true') {
            whereClause.is_featured = true;
            console.log('Filtering featured products');
        }

        // Filter by price range
        if (min_price || max_price) {
            whereClause.price = {};
            if (min_price) {
                whereClause.price[Op.gte] = parseFloat(min_price);
                console.log('Min price filter:', min_price);
            }
            if (max_price) {
                whereClause.price[Op.lte] = parseFloat(max_price);
                console.log('Max price filter:', max_price);
            }
        }

        // Search by name or description
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
            console.log('Search term:', search);
        }

        console.log('Final where clause:', JSON.stringify(whereClause, null, 2));

        // Sorting
        let order = [['created_at', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];
        if (sort === 'name_asc') order = [['name', 'ASC']];
        if (sort === 'name_desc') order = [['name', 'DESC']];
        console.log('Order by:', order);

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        console.log('Pagination:', { page: parseInt(page), limit: parseInt(limit), offset });

        console.log('Executing query...');
        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'is_primary']
                }
            ],
            order,
            limit: parseInt(limit),
            offset
        });

        console.log('Query successful!');
        console.log('Total products in DB:', count);
        console.log('Products fetched:', products.length);
        console.log('Products with images:', products.filter(p => p.images && p.images.length > 0).length);
        console.log('Featured products:', products.filter(p => p.is_featured).length);

        res.status(200).json({
            success: true,
            count: products.length,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / parseInt(limit)),
            data: products
        });

        console.log('Response sent successfully');
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ GET ALL PRODUCTS ERROR:', error.message);
        console.error('Error stack:', error.stack);
        console.log('========================================\n');

        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
    console.log('\n========== GET FEATURED PRODUCTS ==========');
    console.log('[GET] /api/products/featured');

    try {
        const { limit = 8 } = req.query;
        console.log('Limit:', limit);

        console.log('Executing query for featured products...');
        const products = await Product.findAll({
            where: {
                is_featured: true,
                is_active: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'is_primary']
                }
            ],
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        console.log('✅ Featured products fetched:', products.length);
        products.forEach(p => {
            console.log(`  - ${p.name}: Rating ${p.rating}/5 (${p.total_reviews} reviews)`);
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

        console.log('Response sent successfully');
        console.log('===========================================\n');

    } catch (error) {
        console.error('❌ GET FEATURED PRODUCTS ERROR:', error.message);
        console.error('Error stack:', error.stack);
        console.log('===========================================\n');

        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
exports.getProductById = async (req, res) => {
    console.log('\n========== GET PRODUCT BY ID ==========');

    try {
        const { identifier } = req.params;
        console.log('Identifier received:', identifier);

        // Check if identifier is a number (ID) or string (slug)
        const whereClause = isNaN(identifier)
            ? { slug: identifier }
            : { id: identifier };

        console.log('Search by:', isNaN(identifier) ? 'slug' : 'id');
        console.log('Where clause:', whereClause);

        console.log('Executing query...');
        const product = await Product.findOne({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['id', 'image_url', 'is_primary'],
                    order: [['is_primary', 'DESC'], ['display_order', 'ASC']]
                }
            ]
        });

        if (!product) {
            console.log('❌ Product not found');
            console.log('=======================================\n');
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.id, '-', product.name);
        console.log('Product details:');
        console.log('  - Images:', product.images?.length || 0);
        console.log('  - Featured:', product.is_featured ? 'Yes' : 'No');
        console.log('  - Rating:', product.rating, '/5');
        console.log('  - Total Reviews:', product.total_reviews);
        console.log('  - Stock:', product.stock_quantity);

        // Increment views
        console.log('Incrementing product views...');
        await product.increment('views');

        res.status(200).json({
            success: true,
            data: product
        });

        console.log('Response sent successfully');
        console.log('=======================================\n');

    } catch (error) {
        console.error('❌ GET PRODUCT ERROR:', error.message);
        console.error('Error stack:', error.stack);
        console.log('=======================================\n');

        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    console.log('\n========== CREATE PRODUCT ==========');
    console.log('Request body:', req.body);

    try {
        const {
            category_id,
            name,
            slug,
            description,
            price,
            compare_price,
            cost_price,
            sku,
            stock_quantity,
            low_stock_threshold,
            is_featured,
            is_active,
            rating,
            total_reviews
        } = req.body;

        // Validation
        if (!name || !price || !category_id) {
            console.log('❌ Validation failed: Missing required fields');
            console.log('Name:', name, 'Price:', price, 'Category ID:', category_id);
            console.log('====================================\n');

            return res.status(400).json({
                success: false,
                message: 'Please provide name, price, and category'
            });
        }

        console.log('✅ Basic validation passed');

        // Validate rating if provided
        if (rating !== undefined && rating !== null && rating !== '') {
            const ratingNum = parseFloat(rating);
            if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
                console.log('❌ Invalid rating:', rating);
                console.log('====================================\n');
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 0 and 5'
                });
            }
            console.log('✅ Rating validated:', ratingNum);
        }

        // Validate total_reviews if provided
        if (total_reviews !== undefined && total_reviews !== null && total_reviews !== '') {
            const reviewsNum = parseInt(total_reviews);
            if (isNaN(reviewsNum) || reviewsNum < 0) {
                console.log('❌ Invalid total_reviews:', total_reviews);
                console.log('====================================\n');
                return res.status(400).json({
                    success: false,
                    message: 'Total reviews must be a positive number'
                });
            }
            console.log('✅ Total reviews validated:', reviewsNum);
        }

        // Check if category exists
        console.log('Checking if category exists:', category_id);
        const category = await Category.findByPk(category_id);
        if (!category) {
            console.log('❌ Category not found');
            console.log('====================================\n');

            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        console.log('✅ Category exists:', category.name);

        // Check if slug already exists
        if (slug) {
            console.log('Checking if slug exists:', slug);
            const existingProduct = await Product.findOne({ where: { slug } });
            if (existingProduct) {
                console.log('❌ Slug already exists');
                console.log('====================================\n');

                return res.status(400).json({
                    success: false,
                    message: 'Product slug already exists'
                });
            }
            console.log('✅ Slug is unique');
        }

        // Check if SKU already exists
        if (sku) {
            console.log('Checking if SKU exists:', sku);
            const existingProduct = await Product.findOne({ where: { sku } });
            if (existingProduct) {
                console.log('❌ SKU already exists');
                console.log('====================================\n');

                return res.status(400).json({
                    success: false,
                    message: 'Product SKU already exists'
                });
            }
            console.log('✅ SKU is unique');
        }

        // Create product
        const productData = {
            category_id,
            name,
            slug,
            description,
            price: parseFloat(price),
            compare_price: compare_price ? parseFloat(compare_price) : null,
            cost_price: cost_price ? parseFloat(cost_price) : null,
            sku,
            stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
            low_stock_threshold: low_stock_threshold ? parseInt(low_stock_threshold) : 10,
            is_featured: is_featured === true || is_featured === 'true',
            is_active: is_active !== undefined ? (is_active === true || is_active === 'true') : true,
            rating: rating ? parseFloat(rating) : 0,
            total_reviews: total_reviews ? parseInt(total_reviews) : 0
        };

        console.log('Creating product with data:', productData);
        const product = await Product.create(productData);

        console.log('✅ Product created successfully!');
        console.log('Product details:');
        console.log('  - ID:', product.id);
        console.log('  - Name:', product.name);
        console.log('  - Price: $', product.price);
        console.log('  - Featured:', product.is_featured);
        console.log('  - Rating:', product.rating);
        console.log('  - Total Reviews:', product.total_reviews);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

        console.log('Response sent successfully');
        console.log('====================================\n');

    } catch (error) {
        console.error('❌ CREATE PRODUCT ERROR:', error.message);
        console.error('Error name:', error.name);
        console.error('Error stack:', error.stack);

        if (error.name === 'SequelizeValidationError') {
            console.log('Validation error details:', error.errors);
            console.log('====================================\n');

            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('Unique constraint error');
            console.log('====================================\n');

            return res.status(400).json({
                success: false,
                message: 'Product with this slug or SKU already exists'
            });
        }

        console.log('====================================\n');
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    console.log('\n========== UPDATE PRODUCT ==========');

    try {
        const { id } = req.params;
        console.log('Product ID:', id);
        console.log('Request body:', req.body);

        const {
            category_id,
            name,
            slug,
            description,
            price,
            compare_price,
            cost_price,
            sku,
            stock_quantity,
            low_stock_threshold,
            is_featured,
            is_active,
            rating,
            total_reviews
        } = req.body;

        console.log('Finding product...');
        const product = await Product.findByPk(id);

        if (!product) {
            console.log('❌ Product not found');
            console.log('====================================\n');

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.name);
        console.log('Current values:');
        console.log('  - Featured:', product.is_featured);
        console.log('  - Rating:', product.rating);
        console.log('  - Total Reviews:', product.total_reviews);

        // Validate rating if provided
        if (rating !== undefined && rating !== null && rating !== '') {
            const ratingNum = parseFloat(rating);
            if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
                console.log('❌ Invalid rating:', rating);
                console.log('====================================\n');
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 0 and 5'
                });
            }
            console.log('✅ New rating validated:', ratingNum);
        }

        // Validate total_reviews if provided
        if (total_reviews !== undefined && total_reviews !== null && total_reviews !== '') {
            const reviewsNum = parseInt(total_reviews);
            if (isNaN(reviewsNum) || reviewsNum < 0) {
                console.log('❌ Invalid total_reviews:', total_reviews);
                console.log('====================================\n');
                return res.status(400).json({
                    success: false,
                    message: 'Total reviews must be a positive number'
                });
            }
            console.log('✅ New total reviews validated:', reviewsNum);
        }

        // Check if category exists if being updated
        if (category_id && category_id !== product.category_id) {
            console.log('Checking new category:', category_id);
            const category = await Category.findByPk(category_id);
            if (!category) {
                console.log('❌ Category not found');
                console.log('====================================\n');

                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            console.log('✅ New category exists:', category.name);
        }

        // Check if slug is being changed and if it already exists
        if (slug && slug !== product.slug) {
            console.log('Checking if new slug exists:', slug);
            const existingProduct = await Product.findOne({ where: { slug } });
            if (existingProduct) {
                console.log('❌ Slug already exists');
                console.log('====================================\n');

                return res.status(400).json({
                    success: false,
                    message: 'Product slug already exists'
                });
            }
            console.log('✅ New slug is unique');
        }

        // Check if SKU is being changed and if it already exists
        if (sku && sku !== product.sku) {
            console.log('Checking if new SKU exists:', sku);
            const existingProduct = await Product.findOne({ where: { sku } });
            if (existingProduct) {
                console.log('❌ SKU already exists');
                console.log('====================================\n');

                return res.status(400).json({
                    success: false,
                    message: 'Product SKU already exists'
                });
            }
            console.log('✅ New SKU is unique');
        }

        // Update product
        const updateData = {
            category_id: category_id || product.category_id,
            name: name || product.name,
            slug: slug || product.slug,
            description: description !== undefined ? description : product.description,
            price: price !== undefined ? parseFloat(price) : product.price,
            compare_price: compare_price !== undefined ? (compare_price ? parseFloat(compare_price) : null) : product.compare_price,
            cost_price: cost_price !== undefined ? (cost_price ? parseFloat(cost_price) : null) : product.cost_price,
            sku: sku !== undefined ? sku : product.sku,
            stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : product.stock_quantity,
            low_stock_threshold: low_stock_threshold !== undefined ? parseInt(low_stock_threshold) : product.low_stock_threshold,
            is_featured: is_featured !== undefined ? (is_featured === true || is_featured === 'true') : product.is_featured,
            is_active: is_active !== undefined ? (is_active === true || is_active === 'true') : product.is_active,
            rating: rating !== undefined && rating !== null && rating !== '' ? parseFloat(rating) : product.rating,
            total_reviews: total_reviews !== undefined && total_reviews !== null && total_reviews !== '' ? parseInt(total_reviews) : product.total_reviews
        };

        console.log('Updating product with data:', updateData);
        await product.update(updateData);

        console.log('✅ Product updated successfully!');
        console.log('New values:');
        console.log('  - Name:', product.name);
        console.log('  - Featured:', product.is_featured);
        console.log('  - Rating:', product.rating);
        console.log('  - Total Reviews:', product.total_reviews);

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });

        console.log('Response sent successfully');
        console.log('====================================\n');

    } catch (error) {
        console.error('❌ UPDATE PRODUCT ERROR:', error.message);
        console.error('Error stack:', error.stack);

        if (error.name === 'SequelizeValidationError') {
            console.log('Validation error:', error.errors);
            console.log('====================================\n');

            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        console.log('====================================\n');
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    console.log('\n========== DELETE PRODUCT ==========');

    try {
        const { id } = req.params;
        console.log('Product ID to delete:', id);

        console.log('Finding product...');
        const product = await Product.findByPk(id);

        if (!product) {
            console.log('❌ Product not found');
            console.log('====================================\n');

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.name);
        console.log('Deleting product...');
        await product.destroy();

        console.log('✅ Product deleted successfully!');

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

        console.log('Response sent successfully');
        console.log('====================================\n');

    } catch (error) {
        console.error('❌ DELETE PRODUCT ERROR:', error.message);
        console.error('Error stack:', error.stack);
        console.log('====================================\n');

        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// @desc    Toggle product active status
// @route   PATCH /api/products/:id/toggle-active
// @access  Private/Admin
exports.toggleProductStatus = async (req, res) => {
    console.log('\n========== TOGGLE PRODUCT STATUS ==========');

    try {
        const { id } = req.params;
        console.log('Product ID:', id);

        console.log('Finding product...');
        const product = await Product.findByPk(id);

        if (!product) {
            console.log('❌ Product not found');
            console.log('===========================================\n');

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.name);
        console.log('Current status:', product.is_active ? 'Active' : 'Inactive');

        const newStatus = !product.is_active;
        console.log('Toggling to:', newStatus ? 'Active' : 'Inactive');

        await product.update({
            is_active: newStatus
        });

        console.log('✅ Status toggled successfully!');

        res.status(200).json({
            success: true,
            message: `Product ${product.is_active ? 'activated' : 'deactivated'} successfully`,
            data: product
        });

        console.log('Response sent successfully');
        console.log('===========================================\n');

    } catch (error) {
        console.error('❌ TOGGLE STATUS ERROR:', error.message);
        console.error('Error stack:', error.stack);
        console.log('===========================================\n');

        res.status(500).json({
            success: false,
            message: 'Error toggling product status',
            error: error.message
        });
    }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
    console.log('\n========== UPDATE PRODUCT STOCK ==========');

    try {
        const { id } = req.params;
        const { stock_quantity } = req.body;

        console.log('Product ID:', id);
        console.log('New stock quantity:', stock_quantity);

        if (stock_quantity === undefined || stock_quantity < 0) {
            console.log('❌ Invalid stock quantity');
            console.log('==========================================\n');

            return res.status(400).json({
                success: false,
                message: 'Please provide a valid stock quantity'
            });
        }

        console.log('Finding product...');
        const product = await Product.findByPk(id);

        if (!product) {
            console.log('❌ Product not found');
            console.log('==========================================\n');

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.name);
        console.log('Current stock:', product.stock_quantity);
        console.log('Updating stock...');

        await product.update({ stock_quantity });

        console.log('✅ Stock updated successfully!');
        console.log('New stock:', product.stock_quantity);

        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            data: product
        });

        console.log('Response sent successfully');
        console.log('==========================================\n');

    } catch (error) {
        console.error('❌ UPDATE STOCK ERROR:', error.message);
        console.error('Error stack:', error.stack);
        console.log('==========================================\n');

        res.status(500).json({
            success: false,
            message: 'Error updating stock',
            error: error.message
        });
    }
};
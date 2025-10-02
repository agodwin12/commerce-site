// backend/src/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        },
        onDelete: 'CASCADE',
        validate: {
            notNull: {
                msg: 'Category is required'
            }
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Product name is required'
            },
            len: {
                args: [2, 255],
                msg: 'Product name must be between 2 and 255 characters'
            }
        }
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            msg: 'Product slug must be unique'
        },
        validate: {
            notEmpty: {
                msg: 'Product slug is required'
            },
            is: {
                args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                msg: 'Slug must be lowercase with hyphens only'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Price is required'
            },
            min: {
                args: [0],
                msg: 'Price must be greater than or equal to 0'
            }
        }
    },
    compare_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: 'Compare price must be greater than or equal to 0'
            }
        }
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: 'Cost price must be greater than or equal to 0'
            }
        }
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: {
            msg: 'SKU must be unique'
        }
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'Stock quantity cannot be negative'
            }
        }
    },
    low_stock_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        validate: {
            min: {
                args: [0],
                msg: 'Low stock threshold cannot be negative'
            }
        }
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00,
        validate: {
            min: {
                args: [0],
                msg: 'Rating must be between 0 and 5'
            },
            max: {
                args: [5],
                msg: 'Rating must be between 0 and 5'
            }
        }
    },
    total_reviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        // Auto-generate slug from name if not provided
        beforeValidate: (product) => {
            if (product.name && !product.slug) {
                product.slug = product.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
        }
    }
});

module.exports = Product;
// backend/src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Category name is required'
            },
            len: {
                args: [2, 100],
                msg: 'Category name must be between 2 and 100 characters'
            }
        }
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'Category slug must be unique'
        },
        validate: {
            notEmpty: {
                msg: 'Category slug is required'
            },
            is: {
                args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                msg: 'Slug must be lowercase with hyphens only (e.g., mens-fashion)'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    display_order: {
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
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        // Auto-generate slug from name if not provided
        beforeValidate: (category) => {
            if (category.name && !category.slug) {
                category.slug = category.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
        }
    }
});

// Self-referential association for parent-child categories
Category.hasMany(Category, {
    as: 'subcategories',
    foreignKey: 'parent_id',
    onDelete: 'SET NULL'
});

Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parent_id',
    onDelete: 'SET NULL'
});

module.exports = Category;
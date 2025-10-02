// backend/src/models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const HeroImage = require('./HeroImage');

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

// Category <-> Product (One-to-Many)
Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products',
    onDelete: 'CASCADE'
});

Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'CASCADE'
});

// Product <-> ProductImage (One-to-Many)
Product.hasMany(ProductImage, {
    foreignKey: 'product_id',
    as: 'images',
    onDelete: 'CASCADE'
});

ProductImage.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
});

// User <-> Cart (One-to-One)
User.hasOne(Cart, {
    foreignKey: 'user_id',
    as: 'cart',
    onDelete: 'CASCADE'
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
});

// Cart <-> CartItem (One-to-Many)
Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    as: 'items',
    onDelete: 'CASCADE'
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart',
    onDelete: 'CASCADE'
});

// Product <-> CartItem (One-to-Many)
Product.hasMany(CartItem, {
    foreignKey: 'product_id',
    as: 'cart_items',
    onDelete: 'CASCADE'
});

CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
});

// User <-> Order (One-to-Many)
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders',
    onDelete: 'CASCADE'
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
});

// Order <-> OrderItem (One-to-Many)
Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items',
    onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order',
    onDelete: 'CASCADE'
});

// Product <-> OrderItem (One-to-Many)
Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    as: 'order_items',
    onDelete: 'CASCADE'
});

OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
});

// ============================================================================
// EXPORT ALL MODELS
// ============================================================================

module.exports = {
    sequelize,
    User,
    Category,
    Product,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    HeroImage
};
// backend/src/models/HeroImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HeroImage = sequelize.define('HeroImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    subtitle: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Image URL is required'
            }
        }
    },
    link_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    button_text: {
        type: DataTypes.STRING(50),
        allowNull: true
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
    tableName: 'hero_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = HeroImage;
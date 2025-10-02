// backend/src/models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        validate: {
            notNull: {
                msg: 'User ID is required'
            }
        }
    },
    order_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Order number must be unique'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    // Shipping Information
    shipping_first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Shipping first name is required'
            }
        }
    },
    shipping_last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Shipping last name is required'
            }
        }
    },
    shipping_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please provide a valid email'
            }
        }
    },
    shipping_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Shipping phone is required'
            }
        }
    },
    shipping_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Shipping address is required'
            }
        }
    },
    shipping_city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Shipping city is required'
            }
        }
    },
    shipping_state: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    shipping_postal_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    shipping_country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Shipping country is required'
            }
        }
    },
    // Order Totals
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Subtotal must be greater than or equal to 0'
            }
        }
    },
    shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Total must be greater than or equal to 0'
            }
        }
    },
    // Payment Information
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
        allowNull: false
    },
    transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // Additional Info
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        // Auto-generate order number before creating
        beforeCreate: async (order) => {
            if (!order.order_number) {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000);
                order.order_number = `ORD-${timestamp}-${random}`;
            }
        }
    }
});

module.exports = Order;
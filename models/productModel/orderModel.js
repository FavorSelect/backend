const { DataTypes } = require('sequelize');
const { sequelize } = require('../../databaseConnection/dbConnection');
const Cart  = require('./cartModel'); 
const User  = require('../authModel/userModel');
const  CartItem  = require('./cartItemModel'); 

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // User model reference
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cart, // Cart model reference
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  orderStatus: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending', // Default order status
  },

  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
    defaultValue: 'Pending',
  },

  paymentMethod: {
    type: DataTypes.ENUM('CreditCard', 'DebitCard', 'PayPal', 'CashOnDelivery'),
    defaultValue: 'CreditCard',
  },

  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically sets the current date
  },

  shippingDate: {
    type: DataTypes.DATE,
  },

  deliveryDate: {
    type: DataTypes.DATE,
  },

}, {
  tableName: 'orders',
  timestamps: true, // Will create createdAt and updatedAt fields
});


module.exports =  Order ;

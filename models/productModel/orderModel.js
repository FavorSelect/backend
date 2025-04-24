const { DataTypes } = require('sequelize');
const { sequelize } = require('../../databaseConnection/dbConnection');
const { Cart } = require('./cartModel'); 
const { User } = require('../authModel/userModel'); 
const { CartItem } = require('./carItemModel'); 

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

// Associations
Order.belongsTo(User, { foreignKey: 'userId' }); // An Order belongs to a User
User.hasMany(Order, { foreignKey: 'userId' }); // A User can have many Orders

Order.belongsTo(Cart, { foreignKey: 'cartId' }); // An Order belongs to a Cart
Cart.hasOne(Order, { foreignKey: 'cartId' }); // A Cart can have one Order

Order.hasMany(CartItem, { foreignKey: 'orderId' }); // An Order can have many CartItems
CartItem.belongsTo(Order, { foreignKey: 'orderId' }); // A CartItem belongs to an Order

module.exports = { Order };

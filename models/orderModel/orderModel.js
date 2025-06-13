const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const Cart  = require('../cartModel/cartModel'); 
const User  = require('../authModel/userModel');
const  CartItem  = require('../cartModel/cartItemModel'); 
const Coupon = require('../couponModel/couponModel');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
uniqueOrderId: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
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
appliedCouponId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: Coupon,
    key: "id"
  }
},

  cartId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

addressId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'addresses',
    key: 'id',
  },
  onDelete: 'SET NULL', // or 'CASCADE' if you want orders to delete when address is deleted
},


  paymentStatus: {
    type: DataTypes.ENUM('Pending','Completed', 'Failed'),
    defaultValue: 'Pending',
  },

  paymentMethod: {
    type: DataTypes.ENUM('CreditCard', 'DebitCard', 'PayPal', 'CashOnDelivery'),
    defaultValue: 'CashOnDelivery',
  },

  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, 
  },

  shippingDate: {
    type: DataTypes.DATE,
  },

  deliveryDate: {
    type: DataTypes.DATE,
  },

}, {
  tableName: 'orders',
  timestamps: true, 
});


module.exports =  Order ;

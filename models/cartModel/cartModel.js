const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User  = require('../authModel/userModel');
const  Product  = require('../productModel/productModel'); 

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // Ensure the cart is deleted if the user is deleted
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product, 
      key: 'id'
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',// Ensure the cart item is deleted if the product is deleted
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default quantity is 1
  },

  status: {
    type: DataTypes.ENUM('active', 'ordered', 'cancelled'),
    defaultValue: 'active', // Default status is 'active'
  },

}, {
  tableName: 'carts',
  timestamps: true, // Add createdAt and updatedAt fields
});


module.exports =  Cart ;

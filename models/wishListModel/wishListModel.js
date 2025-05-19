const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User  = require('../authModel/userModel');
const  Product  = require('../productModel/productModel');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

}, {
  tableName: 'wishlists',
  timestamps: true,
});

module.exports =  Wishlist ;

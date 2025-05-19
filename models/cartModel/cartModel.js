const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User  = require('../authModel/userModel');

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
    onUpdate: 'CASCADE',
  },

  status: {
    type: DataTypes.ENUM('active', 'ordered', 'cancelled'),
    defaultValue: 'active',
  }

}, {
  tableName: 'carts',
  timestamps: true,
});

module.exports = Cart;
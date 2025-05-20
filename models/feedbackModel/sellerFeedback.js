const { DataTypes } = require('sequelize');
const { sequelize }  = require('../../mysqlConnection/dbConnection');
const User   = require('../authModel/userModel');      
const Order  = require('../orderModel/orderModel'); 
const Seller = require('../authModel/sellerModel')


const SellerFeedback = sequelize.define('SellerFeedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Seller,          
      key: 'id',
    },
    onDelete: 'CASCADE',
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


  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },

  textComment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },


  sellerResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'seller_feedbacks',
  timestamps: true,   
});

module.exports = SellerFeedback;

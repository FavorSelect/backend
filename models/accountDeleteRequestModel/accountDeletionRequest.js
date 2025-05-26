const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User = require('../authModel/userModel');
const Seller = require('../authModel/sellerModel');

const AccountDeletionRequest = sequelize.define('AccountDeletionRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Seller,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
 reason: {
  type: DataTypes.STRING,
  allowNull: true
},
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  uniqueAccountDeletedId: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true
  },
   deletedUserEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deletedUserName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  deletedSellerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deletedSellerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'account_deletion_requests',
  timestamps: true
});

module.exports = AccountDeletionRequest;

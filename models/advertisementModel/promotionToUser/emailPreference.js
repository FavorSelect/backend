const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../mysqlConnection/dbConnection');
const User = require('../../authModel/userModel');

const EmailPreference = sequelize.define('EmailPreference', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  promotions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  productLaunches: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'email_preferences',
  timestamps: true,
});

module.exports = EmailPreference;

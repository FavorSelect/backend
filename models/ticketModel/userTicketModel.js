const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User = require('../authModel/userModel');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
   ticketNumber: {
    type: DataTypes.STRING(8),
    unique: true,
    allowNull: false
  },


  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  imageUrl: {
    type: DataTypes.STRING, // Store image path or URL
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('open', 'in progress', 'resolved'),
    defaultValue: 'open'
  },

  adminReply: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: 'tickets',
  timestamps: true
});

module.exports = Ticket;

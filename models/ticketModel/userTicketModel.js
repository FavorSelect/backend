const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const User = require('../authModel/userModel');

const UserTicket = sequelize.define('UserTicket', {
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

  image: {
    type: DataTypes.STRING, 
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM("open", "in_progress", "closed","resolved"),
    defaultValue: 'Open'
  },


  adminReply: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: 'usertickets',
  timestamps: true
});

module.exports = UserTicket;

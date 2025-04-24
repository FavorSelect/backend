const { DataTypes } = require('sequelize');
const { sequelize } = require('../../databaseConnection/dbConnection');

const User = sequelize.define('User', {
  // id: {
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4, 
  //   primaryKey: true
  // },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin'),
    defaultValue: 'customer'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationCode: {
    type: DataTypes.STRING,
  },
  verificationCodeExpiresAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = { User };

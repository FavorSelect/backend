const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, 
    primaryKey: true,   
  },
  googleId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true
},
 facebookId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true
},
twitterId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true
},


  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
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
    type: DataTypes.ENUM('user','admin', 'admin+', 'superadmin'),
    defaultValue: 'user'
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

module.exports =  User ;

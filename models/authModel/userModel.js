const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    facebookId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    twitterId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("active", "suspended", "deleted"),
      defaultValue: "active",
    },
    canReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    authProvider: {
      type: DataTypes.ENUM("local", "google", "facebook", "twitter"),
      defaultValue: "local",
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    zipCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },

    role: {
      type: DataTypes.ENUM("user", "admin", "admin+", "superadmin", "seller"),
      defaultValue: "user",
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
     isTwoFactorAuthEnable: {
     type: DataTypes.BOOLEAN,
      defaultValue: false, 
  },
    verificationCode: {
      type: DataTypes.STRING,
    },
    verificationCodeExpiresAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;

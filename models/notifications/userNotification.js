const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const User = require("../authModel/userModel");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("order", "account","support","global", "custom","coupon"),
      defaultValue: "custom",
    },
   userId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: User,
      key: 'id',
    },
  },
  
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

module.exports = Notification;

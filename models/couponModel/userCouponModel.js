const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const User = require("../authModel/userModel");
const Coupon = require("./couponModel");

const UserCoupon = sequelize.define(
  "UserCoupon",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Coupon,
        key: "id",
      },
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    applied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_coupons",
    timestamps: false,
  }
);

module.exports = UserCoupon;

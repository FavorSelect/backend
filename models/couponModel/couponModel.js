const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const Coupon = sequelize.define("Coupon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  discountAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  validTill: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maxUsageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  autoAssignOnSignup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "coupons",
  timestamps: true,
});

module.exports = Coupon;
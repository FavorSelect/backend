const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const AdminStats = sequelize.define(
  "AdminStats",
  {
    totalRevenue: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalRevenuePercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalOrdersPercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    totalCustomers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalCustomersPercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = AdminStats;

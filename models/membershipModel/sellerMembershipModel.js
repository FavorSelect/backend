const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const Membership = sequelize.define("Membership", {
  planName: {
    type: DataTypes.ENUM("Basic", "Standard", "Premium", "Enterprise"),
    allowNull: false,
  },
  durationInDays: {
    type: DataTypes.ENUM("90", "180", "365", "1825"), 
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "memberships",
  timestamps: true,
});

module.exports = Membership;

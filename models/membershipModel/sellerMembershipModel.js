const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const Membership = sequelize.define("Membership", {
  planName: {
    type: DataTypes.ENUM("Basic", "Standard", "Premium"),
    allowNull: false,
  },
  durationInDays: {
    type: DataTypes.ENUM("30","90", "180", "365", "730"), 
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

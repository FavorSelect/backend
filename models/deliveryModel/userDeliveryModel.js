const { DataTypes } = require('sequelize');
const { sequelize } = require('../../mysqlConnection/dbConnection');
const DeliveryEstimate = sequelize.define("DeliveryEstimate", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  estimates: {
    type: DataTypes.JSON, // key: productId, value: delivery info
    allowNull: false,
    defaultValue: {}, // example: { "80": { distance: 12.4, eta: "2 days", deliveryDate: "2025-06-21" } }
  },
});

module.exports = DeliveryEstimate;

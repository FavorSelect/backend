const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const SearchHistory = sequelize.define(
  "SearchHistory",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "products", key: "id" },
    },
  searchText: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: [],
},

  },
  { timestamps: true }
);

module.exports = SearchHistory;

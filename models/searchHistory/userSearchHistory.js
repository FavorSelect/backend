const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const SearchHistory = sequelize.define(
  "SearchHistory",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    productIdList: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    searchTextList: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SearchHistory;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parentCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true, // null for main categories
      references: {
        model: "categories", // refers to the same table
        key: "id",
      },
    },
    categoryProductCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    categoryDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    hooks: {
      beforeValidate: (category) => {
        for (let key in category.dataValues) {
          if (typeof category[key] === "string") {
            category[key] = category[key].trim();
          }
        }
      },
    },
  }
);

module.exports = Category;

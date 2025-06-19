// Review Model
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const User = require("../authModel/userModel");
const Product = require("../productModel/productModel");

const Review = sequelize.define(
  "Review",
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
      onDelete: "CASCADE",
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },

    reviewText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewPhoto: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    reviewLike: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    reviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
  }
);

module.exports = Review;

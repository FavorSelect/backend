const { DataTypes } = require("sequelize");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const Cart = require("../../models/cartModel/cartModel");
const Product = require("../../models/productModel/productModel");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: "id",
      },
      onDelete: "CASCADE", // Ensure the cart item is deleted if the cart is deleted
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
    selectedSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selectedColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, 
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, 
    },
  },
  {
    tableName: "cart_items",
    timestamps: true,
  }
);

// Calculate totalPrice based on quantity and price
CartItem.beforeSave((cartItem) => {
  cartItem.totalPrice = cartItem.quantity * cartItem.price;
});

module.exports = CartItem;

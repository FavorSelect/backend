const { DataTypes } = require('sequelize');
const { sequelize } = require('../../databaseConnection/dbConnection');
const  Cart  = require('./cartModel'); 
const  Product  = require('./productModel'); 

const CartItem = sequelize.define('CartItem', {
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
      key: 'id',
    },
    onDelete: 'CASCADE', // Ensure the cart item is deleted if the cart is deleted
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product, 
      key: 'id',
    },
    onDelete: 'CASCADE', // Ensure the cart item is deleted if the product is deleted
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default quantity is 1
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Calculated as quantity * price
  },

}, {
  tableName: 'cart_items',
  timestamps: true, 
});

// Associations
CartItem.belongsTo(Cart, { foreignKey: 'cartId' }); // A CartItem belongs to a Cart
Cart.hasMany(CartItem, { foreignKey: 'cartId' }); // A Cart can have many CartItems

CartItem.belongsTo(Product, { foreignKey: 'productId' }); // A CartItem belongs to a Product
Product.hasMany(CartItem, { foreignKey: 'productId' }); // A Product can be in many CartItems

// Calculate totalPrice based on quantity and price
CartItem.beforeSave((cartItem) => {
  cartItem.totalPrice = cartItem.quantity * cartItem.price;
});

module.exports = CartItem ;

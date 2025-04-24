const User = require('../authModel/userModel');
const Product = require('../productModel/productModel');
const Category = require('../productModel/categoryModel');
const Cart = require('../productModel/cartModel');
const CartItem = require('../productModel/cartItemModel');
const Address = require('../productModel/orderAddressModel');
const Order = require('../productModel/orderModel');
const OrderItem = require('../productModel/orderItemModel');
const Payment = require('../productModel/paymentModel');
const Review = require('../productModel/reviewModel');
const Wishlist = require('../productModel/wishListModel');


console.log('Cart type check:', typeof Cart); // Should be 'function'
console.log('Cart is model?', Cart?.prototype instanceof require('sequelize').Model); // Should be true
console.log('Cart name:', Cart?.prototype?.constructor?.name); // Should be 'Cart'

// Cart <-> CartItem
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

// CartItem <-> Product
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

console.log('User:', typeof User); // Should be function
console.log('User is model?', User?.prototype instanceof require('sequelize').Model); // true
console.log('User name:', User?.prototype?.constructor?.name);


// Cart <-> User
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

// Address <-> User
Address.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId' });

// OrderItem <-> Order
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

// OrderItem <-> Product
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// Order <-> User
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

// Order <-> Cart
Order.belongsTo(Cart, { foreignKey: 'cartId' });
Cart.hasOne(Order, { foreignKey: 'cartId' });

// Order <-> CartItem
Order.hasMany(CartItem, { foreignKey: 'orderId' });
CartItem.belongsTo(Order, { foreignKey: 'orderId' });

// Payment <-> Order
Payment.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasOne(Payment, { foreignKey: 'orderId' });

// Product <-> Category
Product.belongsTo(Category, { foreignKey: 'productCategoryId' });
Category.hasMany(Product, { foreignKey: 'productCategoryId' });

// Review <-> User
Review.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

// Review <-> Product
Review.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Review, { foreignKey: 'productId' });

// Wishlist <-> User
Wishlist.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Wishlist, { foreignKey: 'userId' });

// Wishlist <-> Product
Wishlist.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });

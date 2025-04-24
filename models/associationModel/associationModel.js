const User = require('./userModel');
const Product = require('./productModel');
const Category = require('./categoryModel');
const Cart = require('./cartModel');
const CartItem = require('./cartItemModel');
const Address = require('./addressModel');
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');
const Payment = require('./paymentModel');
const Review = require('./reviewModel');
const Wishlist = require('./wishlistModel');

// Cart <-> CartItem
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

// CartItem <-> Product
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

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

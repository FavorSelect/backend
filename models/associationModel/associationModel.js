const User = require("../authModel/userModel");
const Product = require("../productModel/productModel");
const Category = require("../categoryModel/categoryModel");
const Cart = require("../cartModel/cartModel");
const CartItem = require("../cartModel/cartItemModel");
const Address = require("../orderModel/orderAddressModel");
const Order = require("../orderModel/orderModel");
const OrderItem = require("../orderModel/orderItemModel");
const Payment = require("../paymentModel/paymentModel");
const Review = require("../reviewModel/reviewModel");
const Wishlist = require("../wishListModel/wishListModel");
const Seller = require("../authModel/sellerModel");
const Membership = require('../membershipModel/sellerMembershipModel')
const ReviewLike = require('../reviewLikeModel/reviewLikeModel')

// Cart <-> CartItem
CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// CartItem <-> Product
CartItem.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(CartItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Cart <-> User
Cart.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Cart, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Address <-> User
Address.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Address, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// OrderItem <-> Order
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// OrderItem <-> Product
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Order <-> User
Order.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Order, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Order <-> Cart
Order.belongsTo(Cart, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Cart.hasOne(Order, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Order <-> CartItem
Order.hasMany(CartItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CartItem.belongsTo(Order, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Payment <-> Order
Payment.belongsTo(Order, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Order.hasOne(Payment, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Product <-> Category
Product.belongsTo(Category, {
  foreignKey: "productCategoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Category.hasMany(Product, {
  foreignKey: "productCategoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Review <-> User
Review.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Review, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Review <-> Product
Review.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(Review, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Wishlist <-> User
Wishlist.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Wishlist, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Wishlist <-> Product
Wishlist.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(Wishlist, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Seller <-> User
Seller.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasOne(Seller, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

  
//Seller <-> membership
Seller.belongsTo(Membership, { foreignKey: "membershipId" });
Membership.hasMany(Seller, { foreignKey: "membershipId" });


//seller<-> product
Product.belongsTo(Seller, {foreignKey: "sellerId",as: "seller",});
Seller.hasMany(Product, {foreignKey: "sellerId",as: "products",});


ReviewLike.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
ReviewLike.belongsTo(Review, { foreignKey: 'reviewId', onDelete: 'CASCADE' });

User.hasMany(ReviewLike, { foreignKey: 'userId' });
Review.hasMany(ReviewLike, { foreignKey: 'reviewId' });


ReviewLike.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ReviewLike, { foreignKey: 'userId' });

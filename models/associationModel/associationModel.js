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
const Membership = require("../membershipModel/sellerMembershipModel");
const ReviewLike = require("../reviewLikeModel/reviewLikeModel");
const UserTicket = require("../ticketModel/userTicketModel");
const SellerTicket = require("../ticketModel/sellerTicket");

// Cart ↔ CartItem
Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", onDelete: "CASCADE" });

// CartItem ↔ Product
Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

// Cart ↔ User
User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Address ↔ User
User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });

// Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

// Order ↔ User
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Order ↔ Cart
Cart.hasOne(Order, { foreignKey: "cartId", onDelete: "CASCADE" });
Order.belongsTo(Cart, { foreignKey: "cartId", onDelete: "CASCADE" });

// Order ↔ CartItem (optional and might be redundant with OrderItems)
Order.hasMany(CartItem, { foreignKey: "orderId", onDelete: "CASCADE" });
CartItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });

// Payment ↔ Order
Order.hasOne(Payment, { foreignKey: "orderId", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });

// Product ↔ Category
Category.hasMany(Product, { foreignKey: "productCategoryId", onDelete: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "productCategoryId", onDelete: "CASCADE" });

User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", as: "user" }); 


// Review ↔ Product
Product.hasMany(Review, { foreignKey: "productId", onDelete: "CASCADE" });
Review.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

// Wishlist ↔ User
User.hasMany(Wishlist, { foreignKey: "userId", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Wishlist ↔ Product
Product.hasMany(Wishlist, { foreignKey: "productId", onDelete: "CASCADE" });
Wishlist.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

// Seller ↔ User
User.hasOne(Seller, { foreignKey: "userId", onDelete: "CASCADE" });
Seller.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Seller ↔ Membership
Membership.hasMany(Seller, { foreignKey: "membershipId" });
Seller.belongsTo(Membership,  { foreignKey: "membershipId", onDelete: "CASCADE" });

// Seller ↔ Product
Seller.hasMany(Product, { foreignKey: "sellerId", as: "products" });
Product.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

// ReviewLike ↔ User & Review
User.hasMany(ReviewLike, { foreignKey: "userId", onDelete: "CASCADE" });
Review.hasMany(ReviewLike, { foreignKey: "reviewId", onDelete: "CASCADE" });
ReviewLike.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
ReviewLike.belongsTo(Review, { foreignKey: "reviewId", onDelete: "CASCADE" });

// User ↔ UserTicket
User.hasMany(UserTicket, { foreignKey: "userId", onDelete: "CASCADE" });
UserTicket.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Seller ↔ SellerTicket
Seller.hasMany(SellerTicket, { foreignKey: "sellerId", onDelete: "CASCADE" });
SellerTicket.belongsTo(Seller, { foreignKey: "sellerId", onDelete: "CASCADE" });

//for self refrencing 
Category.hasMany(Category, {
  foreignKey: 'parentCategoryId',
  as: 'subcategories',
});

Category.belongsTo(Category, {
  foreignKey: 'parentCategoryId',
  as: 'parentCategory',
});


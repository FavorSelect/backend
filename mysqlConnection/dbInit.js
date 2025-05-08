const {sequelize} = require('./dbConnection');
const Cart = require('../models/cartModel/cartModel');
const User = require('../models/authModel/userModel'); 
const  Product  = require('../models/productModel/productModel');
const Category = require('../models/categoryModel/categoryModel')
const CartItem = require('../models/cartModel/cartItemModel');
const Order = require('../models/orderModel/orderModel');
const OrderItem = require('../models/orderModel/orderItemModel');
const Address = require('../models/orderModel/orderAddressModel');
const Wishlist = require('../models/wishListModel/wishListModel');
const Review = require('../models/reviewModel/reviewModel');
const Coupon = require('../models/couponModel/couponModel');
const Payment = require('../models/paymentModel/paymentModel');
const Seller = require('../models/authModel/sellerModel');
const ReviewLike = require('../models/reviewLikeModel/reviewLikeModel');
const Membership = require('../models/membershipModel/sellerMembershipModel')




const initDB = (callback) => {
  sequelize.authenticate()
    .then(() => {
      console.log(' Database connected');
      require('../models/associationModel/associationModel');
      return sequelize.sync(); // Creates tables if not exist
    })
    .then(() => {
      console.log(' All models synced');
      callback(); // Call the callback to start server
    })
    .catch((error) => {
      console.error(' Error connecting to the database:', error);
      process.exit(1); // Exit on failure
    });
};

module.exports = initDB;

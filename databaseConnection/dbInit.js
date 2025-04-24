const {sequelize} = require('../databaseConnection/dbConnection');
const Cart = require('../models/productModel/cartModel');
const User = require('../models/authModel/userModel'); 
const  Product  = require('../models/productModel/productModel');
const Category = require('../models/productModel/categoryModel')
const CartItem = require('../models/productModel/cartItemModel');
const Order = require('../models/productModel/orderModel');
const OrderItem = require('../models/productModel/orderItemModel');
const Address = require('../models/productModel/orderAddressModel');
const Wishlist = require('../models/productModel/wishListModel');
const Review = require('../models/productModel/reviewModel');
const Coupon = require('../models/productModel/couponModel');
const Payment = require('../models/productModel/paymentModel');
const Seller = require('../models/authModel/sellerModel');
const SellerAgreement = require('../models/authModel/sellerAgreementModel');




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

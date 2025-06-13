const {sequelize} = require('./dbConnection');
const Cart = require('../models/cartModel/cartModel');
const User = require('../models/authModel/userModel'); 
const Product  = require('../models/productModel/productModel');
const Category = require('../models/categoryModel/categoryModel')
const CartItem = require('../models/cartModel/cartItemModel');
const Order = require('../models/orderModel/orderModel');
const OrderItem = require('../models/orderModel/orderItemModel');
const Address = require('../models/orderModel/orderAddressModel');
const Wishlist = require('../models/wishListModel/wishListModel');
const Review = require('../models/reviewModel/reviewModel');
const Payment = require('../models/paymentModel/paymentModel');
const Seller = require('../models/authModel/sellerModel');
const ReviewLike = require('../models/reviewLikeModel/reviewLikeModel');
const Membership = require('../models/membershipModel/sellerMembershipModel');
const homepageBanner = require('../models/advertisementModel/websiteAdvertisement/homepageBanner');
const Logo = require('../models/advertisementModel/websiteAdvertisement/logoModel');
const AccountDeletionRequest  = require('../models/accountDeleteRequestModel/accountDeletionRequest');
const BrandPoster = require('../models/advertisementModel/websiteAdvertisement/brandAdsPoster');
const ProductPosterAds = require('../models/advertisementModel/websiteAdvertisement/productPosterAds');
const ThePopular = require('../models/advertisementModel/websiteAdvertisement/thepopular');
const WeeklyPromotion = require('../models/advertisementModel/websiteAdvertisement/weeklyPromotion');
const SellerFeedback = require('../models/feedbackModel/sellerFeedback');
const SellerTicket = require('../models/ticketModel/sellerTicket');
const UserTicket = require('../models/ticketModel/userTicketModel');
const AppliedCoupon = require('../models/couponModel/appliedCoupon');
const Coupon = require('../models/couponModel/couponModel');
const UserCoupon = require('../models/couponModel/userCouponModel')


const initDB = (callback) => {
  sequelize.authenticate()
    .then(() => {
      console.log(' Database connected');
      require('../models/associationModel/associationModel');
      return sequelize.sync(); // Creates tables if not exist {alter:true}
    })
    .then(() => {
      console.log(' All models synced');
      callback(); 
    })
    .catch((error) => {
      console.error(' Error connecting to the database:', error);
      process.exit(1); 
    });
};

module.exports = initDB;

require("./schedular/sellerMembershipSchedular");
require("dotenv").config();
const express = require("express");
const initDB = require("./mysqlConnection/dbInit");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const checkForAuthenticationCookie = require("./authMiddleware/authMiddleware");
const { authorizeRoles } = require("./authMiddleware/roleMiddleware");

//route
const userAuthRoute = require("./routes/authRoute/userAuthRoute");
const userProfileRoute = require("./routes/profileRoute/userProfileRoute");
const handleProductRoute = require("./routes/sellerRoute/product/handleProductRoute");
const sellerAuthRoute = require("./routes/authRoute/sellerAuthRoute");
const sellerProfileRoute = require("./routes/profileRoute/sellerProfileRoute");
const userCartRoute = require("./routes/cartRoute/userCartRoute");
const productApprovalRoute = require("./routes/adminRoute/productApproval/product");
const sellerApprovalRoute = require("./routes/adminRoute/sellerApproval/seller");
const membershipRoute = require("./routes/adminRoute/membershipRoute/membershipRoute");
const sellerMembershipRoute = require("./routes/sellerRoute/memebership/membershipRoute");
const categoryRoute = require("./routes/categoryRoute/categoryRoute");
const wislistRoute = require("./routes/wishlistRoute/wishlistRoute");
const reviewRoute = require("./routes/reviewRoute/reviewRoute");
const userAddressRoute = require("./routes/addressRoute/userAddressRoute");
const orderRoute = require("./routes/orderRoute/orderRoute");
const reviewLikeRoute = require("./routes/reviewLikeRoute/reviewLikeRoute");
const googleAuthRoute = require("./routes/googleAuthRoute/googleAuthRoute");
const facebookAuthRoute = require("./routes/facebookAuth/facebookAuthRoute");
const twitterAuthRoute = require("./routes/twitterAuthRoute/twitterAuthRoute");
const BannerRoute = require("./routes/advertisementRoute/Banner");
const userTicketRoute = require("./routes/ticketRoute/userTicketRoute");
const sellerTicketRoute = require("./routes/ticketRoute/sellerTicketRoute");
const userDetailRoute = require("./routes/adminRoute/userDetail/userDetailRoute");
const sellerDetailRoute = require("./routes/adminRoute/sellerDetail/sellerDetailRoute");
const orderManageRoute = require("./routes/orderRoute/orderManagementRoute");
const productDetailRoute = require("./routes/adminRoute/productDetail/productDetailRoute");
const logoRoute = require("./routes/advertisementRoute/logoRoute");
const handleCategoryRoute = require("./routes/adminRoute/handleCategory/handleCategoryRoute");
const productRoute = require("./routes/productRoute/productRoute");
const handleReviewPermission = require("./routes/adminRoute/handleReviewPermission/reviewPermission");
const sellerFeedbackRoute = require("./routes/feedbackRoute/sellerFeedbackRoute");
const accountDeleteRequestRoute = require("./routes/accountDeleteRequestRoute/accountDeleteRequestRoute");
const emailPreference = require('./routes/promotionRoute/emailPreference');
const imageSearchRoute = require("./routes/imageSearch/imageSearchRoute");
const recommendationRoute = require('./routes/recommendationRoute/recommendation');
const adminStatsRoute = require('./routes/statistic/adminDashboard');
const recentAdminStats = require('./routes/statistic/recent');
const graphStatsRoute = require('./routes/statistic/graphStats');
const adminNotificationsRoute = require('./routes/adminRoute/notifications/userNotification');
const generalNotificationsRoute = require('./routes/notifications/userNotification');
const couponManagementRoute = require('./routes/adminRoute/couponRoute/userCoupon');
const userCouponRoute = require('./routes/couponRoute/userCouponRoute');
const optionalAuthentication = require("./authMiddleware/optionalMiddleware");
const stripeCheckoutRoute = require('./routes/orderRoute/stripeRoute');
const estimateDeliveryRoute = require('./routes/deliveryRoute/estimateDelivery');
const warehouseAddRoute = require('./routes/deliveryRoute/adminWarehouseAdd')


const app = express();
const PORT = process.env.PORT || 8001;

const allowedOrigins = [process.env.FRONTEND_URL_MAIN, process.env.FRONTEND_URL_ADMIN,process.env.FRONTEND_URL_MAIN_L,process.env.FRONTEND_URL_ADMIN_L];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/api/auth",
  googleAuthRoute,
  facebookAuthRoute,
  twitterAuthRoute,
  userAuthRoute,
  sellerAuthRoute
);
app.use(
  "/api/user",
  checkForAuthenticationCookie("token"),
  userProfileRoute,
  wislistRoute,
  reviewRoute,
  userCartRoute,
  userAddressRoute,
  orderRoute,
  reviewLikeRoute,
  sellerFeedbackRoute,
  emailPreference,
  userCouponRoute,
  stripeCheckoutRoute,
  estimateDeliveryRoute
);
app.use("/api/general", categoryRoute, productRoute,imageSearchRoute,generalNotificationsRoute);
app.use("/api/recommendation",  optionalAuthentication("token"), recommendationRoute);
app.use("/api/common-seller-admin", orderManageRoute);
app.use(
  "/api/admin/dashboard",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  productApprovalRoute,
  sellerApprovalRoute,
  membershipRoute,
  handleCategoryRoute,
  userDetailRoute,
  sellerDetailRoute,
  productDetailRoute,
  handleReviewPermission,
  adminStatsRoute,
  recentAdminStats,
  graphStatsRoute,
  adminNotificationsRoute,
  couponManagementRoute,
   warehouseAddRoute
);
app.use(
  "/api/seller/dashboard",
  checkForAuthenticationCookie("token"),
  sellerProfileRoute,
  handleProductRoute,
  sellerMembershipRoute,
  sellerTicketRoute
);

//for ads
app.use("/api/advertisement",BannerRoute, logoRoute);
app.use(
  "/api/support",
  userTicketRoute,
  sellerTicketRoute,
  accountDeleteRequestRoute
);


//for checking
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

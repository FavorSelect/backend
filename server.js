require("./schedular/sellerMembershipSchedular");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const initDB = require("./mysqlConnection/dbInit");
const cors = require("cors");
const checkForAuthenticationCookie = require("./authMiddleware/authMiddleware");
const { authorizeRoles } = require("./authMiddleware/roleMiddleware");
//route
const userAuthRoute = require("./routes/authRoute/userAuthRoute");
const userProfileRoute = require("./routes/profileRoute/userProfileRoute");
const productRoute = require("./routes/sellerRoute/product/productRoute");
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
const orderRoute = require('./routes/orderRoute/orderRoute')
const reviewLikeRoute = require('./routes/reviewLikeRoute/reviewLikeRoute')
const googleAuthRoute = require('./routes/googleAuthRoute/googleAuthRoute');
const facebookAuthRoute = require('./routes/facebookAuth/facebookAuthRoute');
const twitterAuthRoute = require('./routes/twitterAuthRoute/twitterAuthRoute')

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors({
  origin:process.env.FRONTEND_URL,  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],  
  credentials:true                                                 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",googleAuthRoute,facebookAuthRoute, twitterAuthRoute, userAuthRoute, sellerAuthRoute);
app.use(
  "/api/user",
  checkForAuthenticationCookie("token"),
  userProfileRoute,
  wislistRoute,
  reviewRoute,
  userCartRoute,
  userAddressRoute,
  orderRoute,
  reviewLikeRoute
);
app.use(
  "/api/admin",
  checkForAuthenticationCookie("token"),
   authorizeRoles(["admin","admin+","superadmin"]),
  productApprovalRoute,
  sellerApprovalRoute,
  membershipRoute,
  categoryRoute
);
app.use(
  "/api/seller",
  checkForAuthenticationCookie("token"),
  sellerProfileRoute,
  productRoute,
  sellerMembershipRoute
);

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

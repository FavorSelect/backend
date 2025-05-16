require("./schedular/sellerMembershipSchedular");
require("dotenv").config();
const express = require("express");
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
const orderRoute = require("./routes/orderRoute/orderRoute");
const reviewLikeRoute = require("./routes/reviewLikeRoute/reviewLikeRoute");
const googleAuthRoute = require("./routes/googleAuthRoute/googleAuthRoute");
const facebookAuthRoute = require("./routes/facebookAuth/facebookAuthRoute");
const twitterAuthRoute = require("./routes/twitterAuthRoute/twitterAuthRoute");
const homepageBanner = require("./routes/advertisementRoute/homepageBanner");
const userTicketRoute = require("./routes/ticketRoute/userTicketRoute");
const sellerTicketRoute = require("./routes/ticketRoute/sellerTicketRoute");
const userDetailRoute = require("./routes/adminRoute/userDetail/userDetailRoute");
const sellerDetailRoute = require("./routes/adminRoute/sellerDetail/sellerDetailRoute");
const orderManageRoute = require("./routes/adminRoute/orderManageRoute/orderManageRoute");
const productDetailRoute = require("./routes/adminRoute/productDetail/productDetailRoute")

const app = express();
const PORT = process.env.PORT || 8001;

const allowedOrigins = [process.env.FRONTEND_URL_P, "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  reviewLikeRoute
);
app.use(
  "/api/admin/dashboard",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  productApprovalRoute,
  sellerApprovalRoute,
  membershipRoute,
  categoryRoute,
  userDetailRoute,
  sellerDetailRoute,
  orderManageRoute,
  productDetailRoute 
);
app.use(
  "/api/seller/dashboard",
  checkForAuthenticationCookie("token"),
  sellerProfileRoute,
  productRoute,
  sellerMembershipRoute,
  sellerTicketRoute
);

app.use("/api/advertisement", homepageBanner);
app.use("/api/support", userTicketRoute, sellerTicketRoute);
initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

require("./schedular/sellerMembershipSchedular");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const initDB = require("./mysqlConnection/dbInit");
const checkForAuthenticationCookie = require("./authMiddleware/authMiddleware/authMiddleware");
const { authorizeRoles } = require("./authMiddleware/roleMiddleware");

//route
const userAuthRoute = require("./routes/authRoute/userAuthRoute");
const userProfileRoute = require("./routes/profileRoute.js/userProfileRoute");
const handleProductRoute = require("./routes/adminRoute/handleProductRoute/handleProductRoute");
const sellerAuthRoute = require("./routes/authRoute/sellerAuthRoute");
const sellerProfileRoute = require("./routes/profileRoute.js/sellerProfileRoute");
const userCartRoute = require("./routes/cartRoute/userCartRoute");
const productApprovalRoute = require("./routes/adminRoute/productApproval/productApprovalRoute");
const sellerApprovalRoute = require("./routes/adminRoute/sellerApproval/sellerApprovalRoute");
const agreementApprovalRoute = require("./routes/adminRoute/agreementApproval/agreementApprovalRoute");
const handleMembershipRoute = require("./routes/adminRoute/membershipRoute/handleMembershipRoute");
const sellerMembershipRoute = require("./routes/sellerRoute/handleMemebershipRoute/sellerMembershipRoute");
const categoryRoute = require("./routes/categoryRoute/categoryRoute");
const wislistRoute = require("./routes/wishlistRoute/wishlistRoute");
const reviewRoute = require("./routes/reviewRoute/reviewRoute");
const userAddressRoute = require("./routes/addressRoute/userAddressRoute");
const orderRoute = require('./routes/orderRoute/orderRoute')

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", userAuthRoute, sellerAuthRoute);
app.use(
  "/api/user",
  checkForAuthenticationCookie("token"),
  userProfileRoute,
  wislistRoute,
  reviewRoute,
  userCartRoute,
  userAddressRoute,
  orderRoute
);
app.use(
  "/api/admin",
  checkForAuthenticationCookie("token"),
   authorizeRoles(["admin","admin+","superadmin"]),
  productApprovalRoute,
  sellerApprovalRoute,
  agreementApprovalRoute,
  handleMembershipRoute,
  categoryRoute
);
app.use(
  "/api/seller",
  checkForAuthenticationCookie("token"),
  sellerProfileRoute,
  handleProductRoute,
  sellerMembershipRoute
);

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

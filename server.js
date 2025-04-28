require("./schedular/sellerMembershipSchedular");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const initDB = require("./mysqlConnection/dbInit");
const checkForAuthenticationCookie = require("./authMiddleware/authMiddleware/authMiddleware");

//route
const userAuthRoute = require("./routes/authRoute/userAuthRoute");
const userProfileRoute = require("./routes/profileRoute.js/userProfileRoute");
const handleProductRoute = require("./routes/adminRoute/handleProductRoute/handleProductRoute");
const sellerAuthRoute = require("./routes/authRoute/sellerAuthRoute");
const sellerProfileRoute = require("./routes/profileRoute.js/sellerProfileRoute");
const cartRoute = require("./routes/cartRoute/cartRoute");
const productApprovalRoute = require("./routes/adminRoute/productApproval/productApprovalRoute");
const sellerApprovalRoute = require("./routes/adminRoute/sellerApproval/sellerApprovalRoute");
const agreementApprovalRoute = require("./routes/adminRoute/agreementApproval/agreementApprovalRoute");
const handleMembershipRoute = require("./routes/adminRoute/membershipRoute/handleMembershipRoute");
const sellerMembershipRoute = require("./routes/sellerRoute/handleMemebershipRoute/sellerMembershipRoute");
const categoryRoute = require('./routes/categoryRoute/categoryRoute')
const wislistRoute = require('./routes/wishlistRoute/wishlistRoute')
const reviewRoute = require('./routes/reviewRoute/reviewRoute')

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", userAuthRoute, sellerAuthRoute);
app.use("/api/user", userProfileRoute,wislistRoute,reviewRoute);
app.use(
  "/api/admin",
  checkForAuthenticationCookie("token"),
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
app.use("/api/cart", checkForAuthenticationCookie("token"), cartRoute);

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

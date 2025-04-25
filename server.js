require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const initDB = require("./databaseConnection/dbInit");

const checkForAuthenticationCookie = require("./middleware/authMiddleware/authMiddleware");
const {
  authorizeRoles,
} = require("./middleware/authMiddleware/roleMiddleware");

//route
const userAuthRoute = require("./routes/authRoute/userAuthRoute");
const userProfileRoute = require("./routes/profileRoute.js/userProfileRoute");
const handleProductRoute = require("./routes/adminRoute/handleProductRoute/handleProductRoute");
const sellerAuthRoute = require('./routes/authRoute/sellerAuthRoute')
const sellerProfileRoute = require('./routes/profileRoute.js/sellerProfileRoute')
const cartRoute = require('./routes/cartRoute/cartRoute')

const app = express();
const PORT = process.env.PORT || 8001;

//app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

app.use("/api/auth", userAuthRoute,sellerAuthRoute);
app.use("/api/profile",checkForAuthenticationCookie("token"),userProfileRoute,sellerProfileRoute);
app.use("/api/admin",checkForAuthenticationCookie("token"), handleProductRoute);
app.use("/api/cart",cartRoute);

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

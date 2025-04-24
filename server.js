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

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userAuthRoute);
app.use(
  "/api/profile",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["customer", "admin"]),
  userProfileRoute
);
app.use(
  "/api/admin",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["customer","admin"]),
  handleProductRoute
);

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

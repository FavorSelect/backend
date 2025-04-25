const express = require("express");
const { sellerSignup, sellerSignin, verifySellerEmail, handleSellerForgotPasswordURL, handleSellerResetPassword } = require("../../controllers/authController/sellerController");
const { handleLogout } = require("../../controllers/authController/userController");

const router = express.Router();

router.post("/signup", sellerSignup);
router.post("/signin", sellerSignin);
router.post("/logout", handleLogout);
router.post("/verify-email", verifySellerEmail);
router.post("/forget-password", handleSellerForgotPasswordURL);
router.post("/reset-password/:resetToken", handleSellerResetPassword);


module.exports = router;

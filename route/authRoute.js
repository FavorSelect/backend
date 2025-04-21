const express = require("express");
const { handleSignUp, handleSignin, handleLogout, handleVerifyEmail, handleForgotPasswordOTP, handleVerifyOtpAndResetPassword} = require("../controllers/userController");
const router = express.Router();

router.post("/signup",handleSignUp);
router.post("/signin", handleSignin);
router.post("/logout", handleLogout);
router.post("/verify-email", handleVerifyEmail);
router.post("/forget-password", handleForgotPasswordOTP);
router.post("/reset-password", handleVerifyOtpAndResetPassword);


module.exports = router;

const express = require("express");
const router = express.Router();
const { handleSignUp, handleSignin, handleLogout, handleVerifyEmail, handleForgotPasswordURL, handleUserResetPassword} = require("../../controllers/authController/userController");

router.post("/signup",handleSignUp);
router.post("/signin", handleSignin);
router.post("/logout", handleLogout);
router.post("/verify-email", handleVerifyEmail);
router.post("/forget-password", handleForgotPasswordURL);
router.post("/reset-password/:resetToken", handleUserResetPassword);

module.exports = router;

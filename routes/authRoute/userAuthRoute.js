const express = require("express");
const { handleSignUp, handleSignin, handleLogout, handleVerifyEmail, handleForgotPasswordURL, handleResetPassword} = require("../../controllers/authController/userController");
const router = express.Router();

router.post("/signup",handleSignUp);
router.post("/signin", handleSignin);
router.post("/logout", handleLogout);
router.post("/verify-email", handleVerifyEmail);
router.post("/forget-password", handleForgotPasswordURL);
router.post("/reset-password/:resetToken", handleResetPassword);


module.exports = router;

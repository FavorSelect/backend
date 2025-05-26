const express = require("express");
const router = express.Router();
const {
  handleSignUp,
  handleSignin,
  handleLogout,
  handleVerifyEmail,
  resendUserVerificationOtp,
  handleFindMyAccountPasswordURL,
  handleResetPasswordOtp,
  handleVerifyResetPasswordOtp,
  handleUserResetPasswordFromUrl,
  handleUserResetPasswordFromOtp,
  verify2FALogin,
} = require("../../controllers/authController/userController");

router.post("/signup", handleSignUp);
router.post("/signin", handleSignin);
router.post("/logout", handleLogout);
router.post("/verify-email", handleVerifyEmail);
router.post("/resend-otp", resendUserVerificationOtp);
router.post("/reset-password-otp", handleResetPasswordOtp);
router.post("/verify-otp", handleVerifyResetPasswordOtp);
router.post("/find-my-account", handleFindMyAccountPasswordURL);
router.post("/find-my-account/:resetToken", handleUserResetPasswordFromUrl);
router.post("/reset-password", handleUserResetPasswordFromOtp);
router.patch('/verify-two-factor',  verify2FALogin);

module.exports = router;

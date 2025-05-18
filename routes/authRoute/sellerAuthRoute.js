const express = require("express");
const {
  sellerSignup,
  sellerSignin,
  verifySellerEmail,
  handleSellerForgotPasswordURL,
  handleSellerResetPassword,
  handleSellerLogout,
  resendSellerVerificationOtp,
} = require("../../controllers/authController/sellerController");

const upload = require('../../awsS3Connection/awsUploadMiddleware')

const router = express.Router();

router.post(
  "/seller-signup",
  upload.fields([
    { name: "shopLogo", maxCount: 1 },
    { name: "businessLicenseDocument", maxCount: 1 },
    { name: "taxDocument", maxCount: 1 },
  ]),
  sellerSignup
);
router.post("/seller-signin", sellerSignin);
router.post("/seller-logout", handleSellerLogout);
router.post("/seller-verify-email", verifySellerEmail);
router.post("/seller-resend-otp", resendSellerVerificationOtp);
router.post("/seller-forget-password", handleSellerForgotPasswordURL);
router.post("/seller-reset-password/:resetToken", handleSellerResetPassword);

module.exports = router;

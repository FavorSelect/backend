const express = require("express");
const {
  sellerSignup,
  sellerSignin,
  verifySellerEmail,
  handleSellerForgotPasswordURL,
  handleSellerResetPassword,
} = require("../../controllers/authController/sellerController");
const {
  handleLogout,
} = require("../../controllers/authController/userController");
const upload = require('../../awsS3Connection/awsUploadMiddleware')

const router = express.Router();

router.post(
  "/seller-signup",
  upload.fields([
    { name: "shopLogo", maxCount: 1 },
    { name: "identityProof", maxCount: 1 },
    { name: "shopRegistrationDocument", maxCount: 1 },
    { name: "taxDocument", maxCount: 1 },
  ]),
  sellerSignup
);
router.post("/signin", sellerSignin);
router.post("/logout", handleLogout);
router.post("/verify-email", verifySellerEmail);
router.post("/forget-password", handleSellerForgotPasswordURL);
router.post("/reset-password/:resetToken", handleSellerResetPassword);

module.exports = router;

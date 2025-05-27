const express = require("express");
const {
  getUserProfile,
  handleUpdateUserProfile,
  handleChangePassword,
  toggleTwoFactorAuth,
  getTwoFactorAuthStatus,
} = require("../../controllers/profileController/userProfileController");
const upload = require("../../awsS3Connection/awsUploadMiddleware");

const router = express.Router();

router.get("/", getUserProfile);
router.put(
  "/edit/profile/:userId",
  upload.single("profilePhoto"),
  handleUpdateUserProfile
);
router.put("/edit/change-password", handleChangePassword);
router.patch('/two-factor-auth', toggleTwoFactorAuth);
router.get('/two-factor-status',  getTwoFactorAuthStatus);


module.exports = router;

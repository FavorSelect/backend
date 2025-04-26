const express = require("express");
const {
  getUserProfile,
  handleUpdateUserProfile,
  handleChangePassword,
} = require("../../controllers/profileController/userProfileController");

const router = express.Router();

router.get("/", getUserProfile);
router.put("/edit/:userId", handleUpdateUserProfile);
router.put("/edit/:userId/change-password", handleChangePassword);

module.exports = router;

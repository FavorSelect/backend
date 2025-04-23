const express = require("express");
const {
  getUserProfile,
  handleUpdateUserProfile,
  handleChangePassword,
} = require("../../controllers/profileController/userProfileController");
const checkForAuthenticationCookie = require("../../middleware/authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../middleware/authMiddleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["customer", "admin"]),
  getUserProfile
);
router.put(
  "/edit/:userId",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["customer", "admin"]),
  handleUpdateUserProfile
);
router.put(
    "/edit/:userId/change-password",
    checkForAuthenticationCookie("token"),
    authorizeRoles(["customer", "admin"]),
    handleChangePassword
  );

module.exports = router;

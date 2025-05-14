const express = require("express");
const {
  handleAddHomepageBanner,
  getHomepageBanners,
} = require("../../controllers/advertiseController/homepageBanner");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const upload = require('../../awsS3Connection/awsUploadMiddleware')

router.post(
  "/add-homepage-banners",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
  handleAddHomepageBanner
);
router.get("/homepage-banners", getHomepageBanners);
module.exports = router;

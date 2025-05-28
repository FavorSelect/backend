const express = require("express");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const upload = require('../../awsS3Connection/awsUploadMiddleware');
const { handleAddLogo } = require("../../controllers/advertiseController/websiteAdvertisement/logoController");

router.post(
  "/add-logo",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
  handleAddLogo
);
module.exports = router;

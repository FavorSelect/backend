const express = require("express");
const upload = require("../../../awsS3Connection/awsUploadMiddleware");
const { createAdminNotification } = require("../../../controllers/notifications/adminsNotification");
const router = express.Router();

router.post(
  "/add-notifications",
  upload.single("coverImage"),
  createAdminNotification
);
module.exports = router;

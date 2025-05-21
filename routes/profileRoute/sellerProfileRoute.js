const express = require("express");
const {
  getSellerProfile,
  updateSellerProfile,
  handleChangePasswordOfSeller,
} = require("../../controllers/profileController/sellerProfileController");
const upload = require("../../awsS3Connection/awsUploadMiddleware");

const router = express.Router();

router.get("/profile", getSellerProfile);
router.put(
  "/profile/edit",
  upload.fields([
    { name: "shopLogo", maxCount: 1 },
    { name: "taxDocument", maxCount: 1 },
  ]),
  updateSellerProfile
);
router.put("/profile/edit/change-password", handleChangePasswordOfSeller);

module.exports = router;

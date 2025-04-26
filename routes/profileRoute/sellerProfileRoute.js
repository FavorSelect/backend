const express = require("express");
const { getSellerProfile, updateSellerProfile, handleChangePasswordOfSeller } = require("../../controllers/profileController/sellerProfileController");

const router = express.Router();

router.get("/",getSellerProfile);
router.put("/edit/:userId", updateSellerProfile);
router.put("/edit/:userId/change-password", handleChangePasswordOfSeller);

module.exports = router;

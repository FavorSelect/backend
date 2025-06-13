const express = require("express");
const {
  handleCreateCoupon,
  getAllCouponsWithUserDetails,
} = require("../../../controllers/adminController/coupon/couponManagement");
const router = express.Router();

router.post("/create-coupons", handleCreateCoupon);
router.get("/coupons", getAllCouponsWithUserDetails);

module.exports = router;

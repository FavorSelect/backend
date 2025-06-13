const express = require("express");
const { applyCouponToProduct } = require("../../controllers/coupon/userCoupon");
const router = express.Router();

router.post("/apply-coupon", applyCouponToProduct);

module.exports = router;

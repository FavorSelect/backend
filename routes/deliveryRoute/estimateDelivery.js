const express = require("express");
const { getEstimateForProductFromGoogle, getEstimateForProductFromOSRM } = require("../../controllers/deliveryController/userDelivery");

const router = express.Router();

//router.get("/estimate/:productId", getEstimateForProductFromGoogle);
router.get("/estimate/:productId", getEstimateForProductFromOSRM);

module.exports = router;

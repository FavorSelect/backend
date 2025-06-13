const express = require("express");
const {
  recommendBasedOnSearch,
} = require("../../controllers/recommendationController/recommendationBasedOnSearch");
const { recommendBasedOnActivity } = require("../../controllers/recommendationController/recommendationBasedOnActivity");
const { recommendCombined } = require("../../controllers/recommendationController/combinedRecommendation");
const router = express.Router();

router.get("/recommendBasedOnSearch", recommendBasedOnSearch);
router.get("/recommendBasedOnActivity", recommendBasedOnActivity);
router.get("/", recommendCombined); 
module.exports = router;

const express = require("express");
const {
  recommendBasedOnSearch,
} = require("../../controllers/recommendationController/recommendationBasedOnSearch");
const { recommendBasedOnActivity } = require("../../controllers/recommendationController/recommendationBasedOnActivity");
const router = express.Router();

router.get("/recommendBasedOnSearch", recommendBasedOnSearch);
router.get("/recommendBasedOnActivity", recommendBasedOnActivity);
module.exports = router;

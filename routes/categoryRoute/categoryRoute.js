const express = require("express");
const router = express.Router();
const {
  handleGetAllCategories,
  getSingleCategoryWithSubcategories,
} = require("../../controllers/categoryController/categoryController");

router.get("/categories/:id/sub-categories", getSingleCategoryWithSubcategories);
router.get("/categories", handleGetAllCategories);
module.exports = router;

const express = require("express");
const router = express.Router();
const {
  handleGetAllCategories,
  getSingleCategoryWithSubcategories,
  getAllCategoriesWithProductCounts,
} = require("../../controllers/categoryController/categoryController");

router.get("/categories/:id/sub-categories", getSingleCategoryWithSubcategories);
router.get("/categories", handleGetAllCategories);
router.get("/categories-with-pro-count", getAllCategoriesWithProductCounts);
module.exports = router;

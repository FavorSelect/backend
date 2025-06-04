const express = require("express");
const {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getRecentProducts,
} = require("../../controllers/productController/productController");
const {
  handleTrackProductClick,
  handleTrackSearch,
} = require("../../controllers/searchHistoryController/userSearch");
const optionalAuthentication = require("../../authMiddleware/optionalMiddleware");
const router = express.Router();

router.get("/products", getAllProducts);
router.get(
  "/products/:productId",
  optionalAuthentication("token"),
  handleTrackProductClick,
  getProductById
);
router.get(
  "/products/search/query",
  optionalAuthentication("token"),
  handleTrackSearch,
  searchProducts
);
router.get("/products/category/:categoryName", getProductsByCategory);
router.get("/products/brand/:brandName", getProductsByBrand);
router.get("/products/recent/latest", getRecentProducts);

module.exports = router;

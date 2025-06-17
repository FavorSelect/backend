const express = require("express");
const {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getRecentProducts,
  getProductsByCategoryMultiple,
  handleGetQuerySuggestions,
  getSimilarProducts,
} = require("../../controllers/productController/productController");
const {
  handleTrackProductClick,
  handleTrackSearch,
} = require("../../controllers/searchHistoryController/userSearch");
const optionalAuthentication = require("../../authMiddleware/optionalMiddleware");
const router = express.Router();
router.get("/search/suggestions",handleGetQuerySuggestions);
router.get("/products/category/:categoryName", getProductsByCategory);
router.get("/products/category/:productId", getProductById);
router.get("/products/by-categories",   getProductsByCategoryMultiple);
router.get("/products/brand/:brandName", getProductsByBrand);
router.get("/products/recent/latest", getRecentProducts);

//http://localhost:8000/api/general/products
router.get("/products", getAllProducts);

router.get(
  "/products/:productId",
  optionalAuthentication("token"),
  handleTrackProductClick,
  getProductById
);
//http://localhost:8000/api/general/products/search/query?query=green
router.get(
  "/products/search/query",
  optionalAuthentication("token"),
  handleTrackSearch,
  searchProducts
);

router.get("/products/similar/:productId", getSimilarProducts);


module.exports = router;

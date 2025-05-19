const express = require("express");
const { getAllProducts, getProductById, searchProducts, getProductsByCategory, getProductsByBrand, getRecentProducts } = require("../../controllers/productController/productController");
const router = express.Router();

// Route: GET /api/products
router.get('/products',getAllProducts);

// Route: GET /api/products/:productId
router.get('/products/:productId',getProductById);

// Route: GET /api/products/search?query=...
router.get("/products/search/query", searchProducts);

// Route: GET /api/products/category/:categoryName
router.get("/products/category/:categoryName", getProductsByCategory);

// Route: GET /api/products/brand/:brandName
router.get("/products/brand/:brandName", getProductsByBrand);

// Route: GET /api/products/recent
router.get("/products/recent/latest", getRecentProducts);

module.exports = router;

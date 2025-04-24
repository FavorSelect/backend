const express = require("express");
const { handleAddProduct } = require("../../../controllers/productController/productController");
const router = express.Router();

router.post('/add-product',handleAddProduct);

module.exports = router;

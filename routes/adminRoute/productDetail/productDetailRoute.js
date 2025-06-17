const express = require("express");
const {
  getAllProducts,
  getProductById,
  getProductCount,
  getProductStats,
  getProductsByStatus,
} = require("../../../controllers/adminController/productDetail/productDetail");
const upload = require("../../../awsS3Connection/awsUploadMiddleware");
const {
  handleAddProduct,
  handleUpdateProduct,
} = require("../../../controllers/productController/productController");
const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products-count", getProductCount);
router.get("/products-stats", getProductStats);
router.get("/products/status/:status", getProductsByStatus);
router.post("/add-products", upload.single("coverImageUrl"), handleAddProduct);
router.put(
  "/update-product/:productId",
  upload.fields([
    { name: "coverImageUrl", maxCount: 1 },
    { name: "galleryImageUrls", maxCount: 5 },
    { name: "productVideoUrl", maxCount: 1 },
  ]),
  handleUpdateProduct
);

module.exports = router;

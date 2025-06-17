const express = require("express");
const {
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} = require("../../../controllers/productController/productController");
const upload = require("../../../awsS3Connection/awsUploadMiddleware");
const checkSellerMembership = require("../../../membershipMiddleware/sellerMembership");
const router = express.Router();

router.post(
  "/add-products",
  checkSellerMembership,
  upload.single("coverImageUrl"),
  handleAddProduct
);
router.put(
  "/update-product/:productId",
  checkSellerMembership,
  upload.fields([
    { name: "coverImageUrl", maxCount: 1 },
    { name: "galleryImageUrls", maxCount: 5 },
    { name: "productVideoUrl", maxCount: 1 },
  ]),
  handleUpdateProduct
);
router.delete("/delete-product", checkSellerMembership, handleDeleteProduct);

module.exports = router;

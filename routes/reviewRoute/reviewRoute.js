const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const {
  handleDeleteUserReviewByAdmin,
  handleDeleteReviewByUser,
  handleUpdateReview,
  getReviewCountForProduct,
  handleGetProductReviews,
  handleAddReview,
  handleGetUserReviewsWithProducts,
} = require("../../controllers/reviewController/reviewController");
const hasPurchasedProduct = require("../../ReviewMiddleware/hasPurchasedProduct");
const canReviewProduct = require("../../ReviewMiddleware/canReviewProduct");
const upload = require("../../awsS3Connection/awsUploadMiddleware");

router.post(
  "/review/add",
  upload.single("reviewPhoto"),
  hasPurchasedProduct,
  canReviewProduct,
  handleAddReview
);

router.get("/my-reviews", handleGetUserReviewsWithProducts);
// Get all reviews for a product
router.get("/review/:productId", handleGetProductReviews);
// Get review count for a product
router.get("/review/:productId/review-count", getReviewCountForProduct);
// Update review by user
router.put(
  "/review/update/:reviewId",
  hasPurchasedProduct,
  canReviewProduct,
  handleUpdateReview
);
// Delete review by user
router.delete(
  "/review/:productId/delete",
  hasPurchasedProduct,
  canReviewProduct,
  handleDeleteReviewByUser
);
// Admin delete review by reviewId
router.delete(
  "/review/:reviewId",
  authorizeRoles(["superadmin"]),
  handleDeleteUserReviewByAdmin
);
module.exports = router;

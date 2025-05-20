const express = require("express");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const {
  handleDeleteUserReviewByAdmin,
  handleDeleteReviewByUser,
  handleUpdateReview,
  getReviewCountForProduct,
  handleGetProductReviews,
  handleAddReview,
} = require("../../controllers/reviewController/reviewController");
const hasPurchasedProduct = require("../../ReviewMiddleware/hasPurchasedProduct");
const canReviewProduct = require("../../ReviewMiddleware/canReviewProduct");
const upload = require("../../awsS3Connection/awsUploadMiddleware");

router.post(
  "/review/add",
  upload.single('reviewPhoto'),
  hasPurchasedProduct,
  canReviewProduct,
  handleAddReview
);
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
  checkForAuthenticationCookie("token"),
  authorizeRoles(["superadmin"]),
  handleDeleteUserReviewByAdmin
);
module.exports = router;

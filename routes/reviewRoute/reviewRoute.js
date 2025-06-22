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

//check for production



router.post(
  "/review/add",
  hasPurchasedProduct,
 canReviewProduct,
  upload.single("reviewPhoto"),
  handleAddReview
);

router.put(
  "/review/:reviewId",
   upload.single("reviewPhoto"),
  handleUpdateReview
);

router.delete(
  "/review/:reviewId",
  handleDeleteReviewByUser
);


// router.delete(
//   "/review/:reviewId",
//   authorizeRoles(["superadmin"]),
//   handleDeleteUserReviewByAdmin
// );

router.get("/my-reviews", handleGetUserReviewsWithProducts);
router.get("/review/:productId", handleGetProductReviews);
router.get("/review/:productId/review-count", getReviewCountForProduct);


module.exports = router;

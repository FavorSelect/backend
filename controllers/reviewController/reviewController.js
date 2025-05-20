const Review = require("../../models/reviewModel/reviewModel");
const Product = require("../../models/productModel/productModel");
const User = require("../../models/authModel/userModel");

const handleAddReview = async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, reviewText } = req.body;
  const reviewPhoto = req.file;

  try {
    const reviewPhotoUrl = reviewPhoto?.location || null;
    const review = await Review.create({
      userId,
      productId,
      rating,
      reviewText,
      reviewPhoto: reviewPhotoUrl,
    });

    // Recalculate average rating and total reviews for the product
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) /
      allReviews.length;

    
    const allTexts = allReviews
      .filter((r) => r.reviewText)
      .map((r) => r.reviewText);
    const allPhotos = allReviews
      .filter((r) => r.reviewPhoto)
      .map((r) => r.reviewPhoto);

    const reviewsData = {
      texts: allTexts,
      photos: allPhotos,
    };


    await Product.update(
      {
        averageCustomerRating: avgRating,
        totalCustomerReviews: allReviews.length,
        customerReviews: JSON.stringify(reviewsData), 
      },
      { where: { id: productId } }
    );

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding review",
      error: error.message,
    });
  }
};
const handleUpdateReview = async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, reviewText } = req.body;
  const reviewPhoto = req.file;

  try {
    const review = await Review.findOne({
      where: { userId, productId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found for this product by the user.",
      });
    }

    const reviewPhotoUrl = reviewPhoto?.location || review.reviewPhoto;

    // Update review fields
    review.rating = rating ?? review.rating;
    review.reviewText = reviewText ?? review.reviewText;
    review.reviewPhoto = reviewPhotoUrl;
    review.reviewDate = new Date();

    await review.save();

    // Recalculate average rating and total reviews for the product
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) /
      allReviews.length;

    // Collect all review texts and photos
    const allTexts = allReviews
      .filter((r) => r.reviewText)
      .map((r) => r.reviewText);
    const allPhotos = allReviews
      .filter((r) => r.reviewPhoto)
      .map((r) => r.reviewPhoto);

    const reviewsData = {
      texts: allTexts,
      photos: allPhotos,
    };

    await Product.update(
      {
        averageCustomerRating: avgRating,
        totalCustomerReviews: allReviews.length,
        customerReviews: JSON.stringify(reviewsData),
      },
      { where: { id: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Review updated",
      review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating review",
      error: error.message,
    });
  }
};
const handleGetProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          model: User,
          as: "user", 
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["reviewDate", "DESC"]],
    });
    const totalReviews = reviews.length;
    res.status(200).json({ success: true, reviews, totalReviews });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
      error: error.message,
    });
  }
};

const getReviewCountForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviewCount = await Review.count({ where: { productId } });
    res.status(200).json({
      success: true,
      productId,
      totalReviews: reviewCount,
    });
  } catch (error) {
    console.error("Error fetching review count:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting review count",
      error: error.message,
    });
  }
};

const handleDeleteReviewByUser = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const review = await Review.findOne({ where: { userId, productId } });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await review.destroy();

    // Recalculate
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / (allReviews.length || 1);

    const allTexts = allReviews
      .filter((r) => r.reviewText)
      .map((r) => r.reviewText);
    const allPhotos = allReviews
      .filter((r) => r.reviewPhoto)
      .map((r) => r.reviewPhoto);

    const reviewsData = {
      texts: allTexts,
      photos: allPhotos,
    };

    await Product.update(
      {
        averageCustomerRating: allReviews.length ? avgRating : 0,
        totalCustomerReviews: allReviews.length,
        customerReviews: JSON.stringify(reviewsData),
      },
      { where: { id: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting review",
      error: error.message,
    });
  }
};

const handleDeleteUserReviewByAdmin = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const productId = review.productId;
    await review.destroy();

    // Recalculate
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / (allReviews.length || 1);

    const allTexts = allReviews
      .filter((r) => r.reviewText)
      .map((r) => r.reviewText);
    const allPhotos = allReviews
      .filter((r) => r.reviewPhoto)
      .map((r) => r.reviewPhoto);

    const reviewsData = {
      texts: allTexts,
      photos: allPhotos,
    };

    await Product.update(
      {
        averageCustomerRating: allReviews.length ? avgRating : 0,
        totalCustomerReviews: allReviews.length,
        customerReviews: JSON.stringify(reviewsData),
      },
      { where: { id: productId } }
    );

    res.status(200).json({
      success: true,
      message: "Review deleted by admin successfully.",
    });
  } catch (error) {
    console.error("Admin Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting review",
      error: error.message,
    });
  }
};


module.exports = {
  handleAddReview,
  handleGetProductReviews,
  getReviewCountForProduct,
  handleUpdateReview,
  handleDeleteReviewByUser,
  handleDeleteUserReviewByAdmin,
};

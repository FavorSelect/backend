const Review = require('../../models/reviewModel/reviewModel');
const Product = require('../../models/productModel/productModel');
const User = require('../../models/authModel/userModel')

const handleAddReview = async (req, res) => {
  const userId = req.user.id; 
  const { productId, rating, reviewText } = req.body;

  try {
    const existingReview = await Review.findOne({ where: { userId, productId } });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }
    const review = await Review.create({ userId, productId, rating, reviewText });
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    await Product.update(
      {
        averageCustomerRating: avgRating,
        totalCustomerReviews: allReviews.length,
      },
      { where: { id: productId } }
    );

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ success: false, message: "Server error while adding review", error: error.message });
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
          as: 'user',   // Very important to match `as: 'user'` which we set in associations
          attributes: ['id', 'fullName', 'email'],  
        }
      ],
      order: [['reviewDate', 'DESC']],
    });

    const totalReviews = reviews.length;

    res.status(200).json({ success: true, reviews,totalReviews });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching reviews", error: error.message });
  }
};


const getReviewCountForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviewCount = await Review.count({
      where: { productId }
    });

    res.status(200).json({
      success: true,
      productId,
      totalReviews: reviewCount
    });
  } catch (error) {
    console.error("Error fetching review count:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting review count",
      error: error.message
    });
  }
};



module.exports = { handleAddReview, handleGetProductReviews ,getReviewCountForProduct};

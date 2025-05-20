const SellerFeedback = require('../../models/feedbackModel/sellerFeedback'); 
const Order = require('../../models/orderModel/orderModel');
const Seller = require('../../models/authModel/sellerModel');

const handleAddSellerFeedback = async (req, res) => {
  const userId = req.user.id;
  const { sellerId, orderId, rating, textComment } = req.body;

  try {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) {
      return res.status(403).json({ success: false, message: 'Order not found or unauthorized' });
    }
    const existingFeedback = await SellerFeedback.findOne({ where: { userId, orderId } });
    if (existingFeedback) {
      return res.status(400).json({ success: false, message: 'Feedback already submitted for this order' });
    }

    const feedback = await SellerFeedback.create({
      sellerId,
      userId,
      orderId,
      rating,
      textComment,
    });

    res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
  } catch (error) {
    console.error('Add Seller Feedback Error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding feedback', error: error.message });
  }
};



const handleGetUserFeedbacks = async (req, res) => {
  const userId = req.user.id;

  try {
    const feedbacks = await SellerFeedback.findAll({
      where: { userId },
      include: [
        {
          model: Seller,
          attributes: ['id', 'shopName','sellerName', 'shopDescription','email']
        },
        {
          model: Order,
          attributes: ['id','uniqueOrderId', 'orderStatus', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('Get User Feedback Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching feedbacks', error: error.message });
  }
};

module.exports = {
    handleAddSellerFeedback,
    handleGetUserFeedbacks
}

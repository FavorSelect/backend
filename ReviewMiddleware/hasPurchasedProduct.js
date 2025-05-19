const Order = require('../models/orderModel/orderModel'); 
const OrderItem = require('../models/orderModel/orderItemModel'); 

const hasPurchasedProduct = async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.body;
  try {
    const orderItem = await OrderItem.findOne({
      where: {
        productId,
      },
      include: [
        {
          model: Order,
          where: { userId, status: 'completed' }, 
        },
      ],
    });

    if (!orderItem) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased.',
      });
    }

    next();
  } catch (error) {
    console.error('Purchase check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking purchase history.',
      error: error.message,
    });
  }
};
module.exports =  hasPurchasedProduct;

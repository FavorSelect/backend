const Order = require('../models/orderModel/orderModel'); 
const OrderItem = require('../models/orderModel/orderItemModel'); 

const hasPurchasedProduct = async (req, res, next) => {
  const userId = req.user.id;
    if (!req.body || !req.body.productId) {
    return res.status(400).json({
      success: false,
      message: 'Missing productId in request body.',
    });
  }
  const  {productId} = req.body;
  try {
    const orderItem = await OrderItem.findOne({
      where: {
        productId,
      },
      include: [
        {
          model: Order,
          where: { userId, orderStatus: 'Delivered' }, 
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

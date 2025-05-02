const Order = require('../../models/orderModel/orderModel');
const OrderItem = require('../../models/orderModel/orderItemModel');
const Product = require('../../models/productModel/productModel');
const Cart = require('../../models/cartModel/cartModel');
const CartItem = require('../../models/cartModel/cartItemModel');
const { sequelize } = require('../../mysqlConnection/dbConnection');

const handleBuyNow = async (req, res) => {
  const { productId, quantity, paymentMethod, shippingAddress } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const totalPrice = product.price * quantity;

    // Simulate payment gateway
    if (paymentMethod !== 'CashOnDelivery') {
      const paymentSuccess = true; // You would integrate actual payment gateway here
      if (!paymentSuccess) return res.status(400).json({ message: 'Payment Failed' });
    }

    const order = await Order.create({
      userId,
      cartId: null,
      totalAmount: totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'CashOnDelivery' ? 'Pending' : 'Completed',
    });

    await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      quantity,
      price: product.price,
      totalPrice,
      productName: product.name,
      productImageUrl: product.image,
    });

    await sendBuyNowOrderEmail(req.user.email, req.user.name, order, {
        productName: product.name,
        quantity,
        price: product.price,
        totalPrice,
        productImageUrl: product.image
      });

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handlePlaceOrderFromCart = async (req, res) => {
  const userId = req.user.id;
  const { paymentMethod, shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    if (paymentMethod !== 'CashOnDelivery') {
      const paymentSuccess = true;
      if (!paymentSuccess) return res.status(400).json({ message: 'Payment Failed' });
    }

    const order = await Order.create({
      userId,
      cartId: cart.id,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'CashOnDelivery' ? 'Pending' : 'Completed',
    });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        productName: item.productName,
        productImageUrl: item.productImageUrl,
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ message: 'Order placed successfully from cart', orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleGetUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleGetSingleOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const orderItems = await OrderItem.findAll({ where: { orderId } });

    res.status(200).json({ order, orderItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    handleGetSingleOrderDetails,
    handleGetUserOrders,
    handlePlaceOrderFromCart,
    handleBuyNow
}

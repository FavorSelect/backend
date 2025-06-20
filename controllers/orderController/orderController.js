const Order = require("../../models/orderModel/orderModel");
const OrderItem = require("../../models/orderModel/orderItemModel");
const Product = require("../../models/productModel/productModel");
const Cart = require("../../models/cartModel/cartModel");
const CartItem = require("../../models/cartModel/cartItemModel");
const Address = require("../../models/orderModel/orderAddressModel");
const { sequelize } = require("../../mysqlConnection/dbConnection");
const {
  sendOrderEmail,
} = require("../../emailService/orderPlacedEmail/orderPlacedEmail");
const { updateRevenueAndOrders } = require("../statistics/adminStats");
const { createUserNotification } = require("../notifications/userNotification");
const UserCoupon = require("../../models/couponModel/userCouponModel");
const Coupon = require("../../models/couponModel/couponModel");
const AppliedCoupon = require("../../models/couponModel/appliedCoupon");

//orderId like -->  333-5555555-6666666
function generateFormattedOrderId() {
  const getRandomDigits = (length) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

  const part1 = getRandomDigits(3);
  const part2 = getRandomDigits(7);
  const part3 = getRandomDigits(7);

  return `${part1}-${part2}-${part3}`;
}

const handleBuyNow = async (req, res) => {
  const { productId, quantity, addressId, paymentMethod } = req.body;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found for this user" });
    }

    const product = await Product.findByPk(productId, { transaction: t });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.availableStockQuantity < quantity) {
      await t.rollback();
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const userCoupon = await UserCoupon.findOne({
      where: {
        userId,
        used: false,
        applied: true,
      },
      include: [
        {
          model: Coupon,
          as: "coupon",
        },
      ],
      transaction: t,
    });

    let discountAmount = 0;
    let appliedCouponId = null;

    if (userCoupon && userCoupon.coupon) {
      const coupon = userCoupon.coupon;
      const productTotal = product.productPrice * quantity;

      if (coupon.discountPercentage) {
        discountAmount = (coupon.discountPercentage / 100) * productTotal;
      } else if (coupon.discountAmount) {
        discountAmount = coupon.discountAmount;
      }

      if (discountAmount > productTotal) discountAmount = productTotal;

      appliedCouponId = coupon.id;
      userCoupon.used = true;
      userCoupon.applied = false;
      await userCoupon.save({ transaction: t });

      coupon.usageCount += 1;
      await coupon.save({ transaction: t });

      await createUserNotification({
        userId,
        title: "Coupon Used",
        message: `Your coupon ${
          coupon.code
        } was used to save ₹${discountAmount.toFixed(2)}.`,
        type: "coupon",
        coverImage: null,
      });
    }

    const totalPrice = product.productPrice * quantity - discountAmount;
    const customOrderId = generateFormattedOrderId();

    const order = await Order.create(
      {
        uniqueOrderId: customOrderId,
        userId,
        cartId: null,
        totalAmount: totalPrice,
        addressId,
        paymentStatus:
          paymentMethod === "CashOnDelivery" ? "Pending" : "Completed",
        paymentMethod,
        appliedCouponId,
      },
      { transaction: t }
    );

    const orderItem = await OrderItem.create(
      {
        orderId: order.id,
        uniqueOrderId: order.uniqueOrderId,
        productId: product.id,
        quantity,
        price: product.productPrice,
        totalPrice,
        productName: product.productName,
        productImageUrl: product.coverImageUrl,
      },
      { transaction: t }
    );

    product.availableStockQuantity -= quantity;
    product.totalSoldCount += quantity;
    await product.save({ transaction: t });

    await t.commit();
    await updateRevenueAndOrders(totalPrice);

    await sendOrderEmail(
      req.user.email,
      req.user.firstName,
      order.uniqueOrderId,
      {
        productName: product.productName,
        quantity,
        price: product.productPrice,
        totalPrice,
        productImageUrl: product.coverImageUrl,
      }
    );

    await createUserNotification({
      userId,
      title: "Order Placed Successfully",
      message: `Your order ${customOrderId} for "${product.productName}" has been placed.`,
      type: "order",
      coverImage: product.coverImageUrl || null,
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: customOrderId,
      order,
      orderItem,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const handlePlaceOrderFromCart = async (req, res) => {
  const userId = req.user.id;
  const { paymentMethod, addressId } = req.body;

  const allowedMethods = [
    "CashOnDelivery",
    "CreditCard",
    "DebitCard",
    "PayPal",
    "Stripe",
  ];
  if (!allowedMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid payment method" });
  }

  const t = await sequelize.transaction();

  try {
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Address not found for this user" });
    }

    const cart = await Cart.findOne({ where: { userId }, transaction: t });
    if (!cart) {
      await t.rollback();
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product }],
      transaction: t,
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    let discountAmount = 0;
    let appliedCouponId = null;

    const userCoupon = await UserCoupon.findOne({
      where: {
        userId,
        used: false,
        applied: true,
      },
      include: [
        {
          model: Coupon,
          as: "coupon",
        },
      ],
      transaction: t,
    });

    if (userCoupon && userCoupon.coupon) {
      const coupon = userCoupon.coupon;

      if (coupon.discountPercentage) {
        discountAmount = (coupon.discountPercentage / 100) * totalAmount;
      } else if (coupon.discountAmount) {
        discountAmount = coupon.discountAmount;
      }

      if (discountAmount > totalAmount) discountAmount = totalAmount;

      appliedCouponId = coupon.id;

      userCoupon.used = true;
      userCoupon.applied = false;
      await userCoupon.save({ transaction: t });

      coupon.usageCount += 1;
      await coupon.save({ transaction: t });

      await createUserNotification({
        userId,
        title: "Coupon Used",
        message: `Your coupon ${
          coupon.code
        } was used to save ₹${discountAmount.toFixed(2)}.`,
        type: "coupon",
        coverImage: null,
      });
    }

    const finalAmount = totalAmount - discountAmount;

    if (paymentMethod !== "CashOnDelivery") {
      const paymentSuccess = true;
      if (!paymentSuccess) {
        await t.rollback();
        return res.status(400).json({ message: "Payment Failed" });
      }
    }

    const customOrderId = generateFormattedOrderId();

    const order = await Order.create(
      {
        uniqueOrderId: customOrderId,
        userId,
        cartId: cart.id,
        totalAmount: finalAmount,
        appliedCouponId,
        addressId,
        paymentMethod,
        paymentStatus:
          paymentMethod === "CashOnDelivery" ? "Pending" : "Completed",
        orderDate: new Date(),
      },
      { transaction: t }
    );

    const emailOrderItems = [];

    for (const item of cartItems) {
      const product = item.Product;
      if (!product) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Product not found for cart item ${item.id}` });
      }

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          productName: product.productName,
          productImageUrl: product.coverImageUrl,
        },
        { transaction: t }
      );

      // Update product stock and sold count
      product.totalSoldCount += item.quantity;
      product.availableStockQuantity -= item.quantity;
      await product.save({ transaction: t });

      emailOrderItems.push({
        productName: product.productName,
        quantity: item.quantity,
        price: product.productPrice || item.price,
        totalPrice: item.totalPrice,
      });
    }

    // Send confirmation email
    await sendOrderEmail(
      req.user.email,
      req.user.firstName,
      order.uniqueOrderId,
      emailOrderItems
    );

    // Empty the cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await updateRevenueAndOrders(finalAmount);

    await createUserNotification({
      userId,
      title: "Order Placed from Cart",
      message: `Your order ${customOrderId} with ${cartItems.length} item(s) has been placed.`,
      type: "order",
      coverImage: cartItems[0]?.Product?.coverImageUrl || null,
    });

    await t.commit();

    return res.status(201).json({
      message: "Order placed successfully from cart",
      uniqueOrderId: customOrderId,
      order,
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const handleGetUserOrders = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;
  try {
    const whereClause = { userId };
    if (status) {
      whereClause.orderStatus = status;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id",
                "productName",
                "productPrice",
                "coverImageUrl",
              ],
            },
          ],
        },
        {
          model: Address,
          as: "shippingAddress",
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "uniqueOrderId",
        "orderStatus",
        "totalAmount",
        "createdAt",
        "updatedAt",
        "orderDate",
        "shippingDate",
        "deliveryDate",
      ],
    });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

const handleGetSingleOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;
  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id",
                "productName",
                "productDescription",
                "productPrice",
                "coverImageUrl",
              ],
            },
          ],
        },
        {
          model: Address,
          as: "shippingAddress",
        },
      ],
      attributes: [
        "id",
        "uniqueOrderId",
        "orderStatus",
        "totalAmount",
        "paymentMethod",
        "paymentStatus",
        "orderDate",
        "shippingDate",
        "deliveryDate",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};

module.exports = {
  handleGetSingleOrderDetails,
  handleGetUserOrders,
  handlePlaceOrderFromCart,
  handleBuyNow,
};

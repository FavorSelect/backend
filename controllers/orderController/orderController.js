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

    // Check if enough stock is available
    if (product.availableStockQuantity < quantity) {
      await t.rollback();
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const totalPrice = product.productPrice * quantity;
    const customOrderId = generateFormattedOrderId();

    // Create the order
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
      },
      { transaction: t }
    );

    // Create order item
   const orderItem = await OrderItem.create(
      {
        orderId: order.id,
        uniqueOrderId:order.uniqueOrderId,
        productId: product.id,
        quantity,
        price: product.productPrice,
        totalPrice,
        productName: product.productName,
        productImageUrl: product.coverImageUrl,
      },
      { transaction: t }
    );

    // Update product stock
    product.availableStockQuantity -= quantity;
    product.totalSoldCount += quantity;
    await product.save({ transaction: t });

    await t.commit();


    await sendOrderEmail(req.user.email, req.user.firstName, order.uniqueOrderId, {
      productName: product.productName,
      quantity,
      price: product.productPrice,
      totalPrice,
      productImageUrl: product.coverImageUrl,
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", orderId: customOrderId ,order ,orderItem});
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

    //  Include associated Product data
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product }], // Important
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
        userId,
        cartId: cart.id,
        totalAmount,
        addressId,
        orderId: customOrderId,
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
      order.orderId,
      emailOrderItems
    );

    // Empty the cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Order placed successfully from cart",
      orderId: customOrderId,
    });
  } catch (error) {
    await t.rollback();
    console.error("Transaction failed:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const handleGetUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "productPrice", "coverImageUrl"]
            }
          ]
        },
        {
          model: Address,
          as: "shippingAddress"
        }
      ],
      order: [["createdAt", "DESC"]],
      attributes: ["id", "uniqueOrderId","orderStatus", "totalAmount", "createdAt", "updatedAt"]
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

const  handleGetSingleOrderDetails = async (req, res) => {
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
              attributes: ["id", "productName", "productDescription", "productPrice", "coverImageUrl"]
            }
          ]
        },
        {
          model: Address,
          as: "shippingAddress"
        }
      ],
       attributes: ["id", "uniqueOrderId", "orderStatus", "totalAmount", "paymentMethod","paymentStatus", "createdAt", "updatedAt"]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order details", error: error.message });
  }
};


module.exports = {
  handleGetSingleOrderDetails,
  handleGetUserOrders,
  handlePlaceOrderFromCart,
  handleBuyNow,
};

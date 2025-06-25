const CartItem = require("../../models/cartModel/cartItemModel");
const Cart = require("../../models/cartModel/cartModel");
const Address = require("../../models/orderModel/orderAddressModel");
const Product = require("../../models/productModel/productModel");
const { handleBuyNow, handlePlaceOrderFromCart } = require("./orderController");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createStripeCheckoutSession = async (req, res) => {
  const { productId, quantity, addressId } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findByPk(productId);
    const address = await Address.findOne({ where: { id: addressId, userId } });

    if (!product || !address) {
      return res.status(404).json({ message: "Product or address not found" });
    }

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.productName,
            images: [product.coverImageUrl],
          },
          unit_amount: product.productPrice * 100,
        },
        quantity,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL_MAIN}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL_MAIN}/order-cancel`,
      metadata: {
        userId: userId.toString(),
        productId: productId.toString(),
        quantity: quantity.toString(),
        addressId: addressId.toString(),
      },
    });

    res.status(200).json({
      id: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

const finalizeBuyNowOrder = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { userId, productId, quantity, addressId } = session.metadata;

    req.user = {
      id: parseInt(userId),
      email: session.customer_details?.email || "no-reply@example.com",
      firstName: session.customer_details?.name || "Customer",
    };

    req.body = {
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      addressId: parseInt(addressId),
      paymentMethod: "Stripe",
    };

    return await handleBuyNow(req, res);
  } catch (err) {
    console.error("Finalize Order Error:", err);
    res
      .status(500)
      .json({ message: "Order finalization failed", details: err.message });
  }
};

const createStripeCartCheckoutSession = async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.body;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product }],
    });

    if (!cart || cartItems.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.Product.productName,
          images: [item.Product.coverImageUrl],
        },
        unit_amount: item.Product.productPrice * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL_MAIN}/cart-order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL_MAIN}/cart-order-cancel`,
      metadata: {
        userId: userId.toString(),
        addressId: addressId.toString(),
        cartId: cart.id.toString(),
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe Cart Session Error:", err);
    res.status(500).json({ message: "Failed to create cart Stripe session" });
  }
};

const finalizePlaceOrderFromCart = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { userId, addressId } = session.metadata;


    req.user = {
      id: parseInt(userId),
      email: session.customer_details?.email || "no-reply@example.com",
      firstName: session.customer_details?.name || "Customer",
    };

    req.body = {
      addressId: parseInt(addressId),
      paymentMethod: "Stripe",
    };

    return await handlePlaceOrderFromCart(req, res);
  } catch (err) {
    console.error("Finalize Cart Order Error:", err);
    res
      .status(500)
      .json({ message: "Failed to finalize cart order", details: err.message });
  }
};

const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;

    try {
      if (metadata?.productId) {
    
        const reqMock = {
          user: {
            id: parseInt(metadata.userId),
            email: session.customer_details?.email,
            firstName: session.customer_details?.name,
          },
          body: {
            productId: parseInt(metadata.productId),
            quantity: parseInt(metadata.quantity),
            addressId: parseInt(metadata.addressId),
            paymentMethod: "Stripe",
          },
        };
        await handleBuyNow(reqMock, { status: () => ({ json: () => {} }) });
      } else if (metadata?.cartId) {

        const reqMock = {
          user: {
            id: parseInt(metadata.userId),
            email: session.customer_details?.email,
            firstName: session.customer_details?.name,
          },
          body: {
            addressId: parseInt(metadata.addressId),
            paymentMethod: "Stripe",
          },
        };
        await handlePlaceOrderFromCart(reqMock, {
          status: () => ({ json: () => {} }),
        });
      }
    } catch (err) {
      console.error(" Error processing order from webhook:", err.message);
    }
  }

  res.status(200).json({ received: true });
};

module.exports = {
  createStripeCheckoutSession,
  finalizeBuyNowOrder,
  createStripeCartCheckoutSession,
  finalizePlaceOrderFromCart,
  stripeWebhookHandler,
};

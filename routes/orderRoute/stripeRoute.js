const express = require("express");
const { createStripeCheckoutSession, finalizeBuyNowOrder, createStripeCartCheckoutSession, finalizePlaceOrderFromCart, stripeWebhookHandler } = require("../../controllers/orderController/stripeController");
const router = express.Router();

router.post("/buy-now/checkout", createStripeCheckoutSession);
router.get("/buy-now/finalize", finalizeBuyNowOrder);
router.post("/cart/checkout", createStripeCartCheckoutSession);
router.get("/cart/finalize", finalizePlaceOrderFromCart);

// Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

module.exports = router;

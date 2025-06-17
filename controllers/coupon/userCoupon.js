const AppliedCoupon = require("../../models/couponModel/appliedCoupon");
const Coupon = require("../../models/couponModel/couponModel");
const UserCoupon = require("../../models/couponModel/userCouponModel");
const Product = require("../../models/productModel/productModel");

const applyCouponToProduct = async (req, res) => {
  const { productId, quantity, couponCode } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const coupon = await Coupon.findOne({ where: { code: couponCode } });
    if (
      !coupon ||
      !coupon.isActive ||
      new Date() < coupon.validFrom ||
      new Date() > coupon.validTill
    ) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    const userCoupon = await UserCoupon.findOne({
      where: { userId, couponId: coupon.id, used: false },
    });

    if (!userCoupon) {
      return res
        .status(400)
        .json({ message: "You are not eligible to use this coupon" });
    }

    userCoupon.applied = true;
    await userCoupon.save();

    const productTotal = product.productPrice * quantity;
    let discountAmount = 0;

    if (coupon.discountPercentage) {
      discountAmount = (coupon.discountPercentage / 100) * productTotal;
    } else if (coupon.discountAmount) {
      discountAmount = coupon.discountAmount;
    }

    if (discountAmount > productTotal) discountAmount = productTotal;

    await AppliedCoupon.destroy({ where: { userId } });

    await AppliedCoupon.create({
      userId,
      couponId: coupon.id,
      productId,
      quantity,
      discountAmount,
    });

    return res.status(200).json({
      message: `Coupon applied successfully. You saved ₹${discountAmount.toFixed(
        2
      )}`,
      discountAmount,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applyCouponToProduct,
};

const User = require("../../../models/authModel/userModel");
const Coupon = require("../../../models/couponModel/couponModel");
const UserCoupon = require("../../../models/couponModel/userCouponModel");

const handleCreateCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, discountAmount, validFrom, validTill, maxUsageLimit, autoAssignOnSignup } = req.body;
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      discountAmount,
      validFrom,
      validTill,
      maxUsageLimit,
      autoAssignOnSignup
    });
    return res.status(201).json({ success: true, coupon });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


// const handleApplyCoupon = async (req, res) => {
//   const { code, cartTotal } = req.body;
//   const userId = req.user.id;

//   const coupon = await Coupon.findOne({ where: { code } });
//   if (!coupon) return res.status(404).json({ message: "Coupon not found" });

//   const userCoupon = await UserCoupon.findOne({
//     where: { userId, couponId: coupon.id, used: false },
//   });
//   if (!userCoupon) return res.status(403).json({ message: "Coupon not assigned or already used" });

//   const now = new Date();
//   if (now < coupon.validFrom || now > coupon.validTill) {
//     return res.status(400).json({ message: "Coupon not valid at this time" });
//   }

//   const discount = coupon.discountPercentage
//     ? (coupon.discountPercentage / 100) * cartTotal
//     : coupon.discountAmount;

//   res.status(200).json({ discount: discount.toFixed(2), couponCode: coupon.code });
// };

// const markCouponAsUsed = async (userId, couponId) => {
//   await UserCoupon.update({ used: true }, {
//     where: { userId, couponId },
//   });
// };


const getAllCouponsWithUserDetails = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      include: [
        {
          model: UserCoupon,
          as: "userCoupons",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
          ],
          attributes: ["used", "assignedAt"],
        },
      ],
    });

    const result = coupons.map((coupon) => {
      const totalAssigned = coupon.userCoupons.length;
      const totalUsed = coupon.userCoupons.filter((uc) => uc.used).length;

      const assignedUsers = coupon.userCoupons.map((uc) => ({
        id: uc.user.id,
        name: `${uc.user.firstName} ${uc.user.lastName}`,
        email: uc.user.email,
        used: uc.used,
        assignedAt: uc.assignedAt,
      }));

      return {
        id: coupon.id,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount: coupon.discountAmount,
        validFrom: coupon.validFrom,
        validTill: coupon.validTill,
        isActive: coupon.isActive,
        autoAssignOnSignup: coupon.autoAssignOnSignup,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
        totalAssignedUsers: totalAssigned,
        totalUsedUsers: totalUsed,
        assignedUsers: assignedUsers,
      };
    });

    return res.status(200).json({ success: true, coupons: result });
  } catch (err) {
    console.error("Get coupons with user details error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}


module.exports = {
    handleCreateCoupon,
    handleApplyCoupon,
    getAllCouponsWithUserDetails
}
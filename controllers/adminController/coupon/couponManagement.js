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
    getAllCouponsWithUserDetails
}
const JWT = require("jsonwebtoken");
function createTokenForUser(user) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }
    const payload = {
      _id: user.id,
      firstName: user.firstName || null,
      lastName:user.lastName || null,
      email: user.email,
      role:user.role || null,
      sellerName:user.sellerName || null,
      isApproved:user.isApproved || false,
      isVerified:user.isVerified,
      isAgreementApproval: user.isAgreementApproval || false,
      contactNumber:user. contactNumber || null,
    };
    return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  } catch (error) {
    console.error("error creating token", error.message);
    return null;
  }
}

const validateToken = (token)=>{
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("error validating token", error.message);
    return res.status(500).json({error:"Validation token error!"});
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};

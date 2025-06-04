const { validateToken } = require("../authService/authService");

function optionalAuthentication() {
  return (req, res, next) => {
    try {
      const authHeaders = req.headers["authorization"];
      const token = authHeaders && authHeaders.split(" ")[1];

      if (!token) {
        // No token found — continue as guest
        return next();
      }

      const userPayload = validateToken(token);

      if (!userPayload) {
        // Invalid token — continue as guest (or you can log if needed)
        return next();
      }

      // Token valid — set user info
      req.user = userPayload;
      next();

    } catch (error) {
      console.error("Error validating token:", error.message);
      // On error, continue as guest, do NOT block request
      next();
    }
  };
}
module.exports = optionalAuthentication;
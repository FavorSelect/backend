const { validateToken } = require("../authService/authService");
const { parse } = require("cookie");

function  optionalAuthentication() {
  return (req, res, next) => {
    try {
      let token;

      if (req.headers.cookie) {
        const parsedCookies = parse(req.headers.cookie);
        token = parsedCookies.token;
      }
      if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }
      if (!token) {
        return next();
      }

      const userPayload = validateToken(token);
      if (!userPayload) {
        return next();
      }

      req.user = userPayload;
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      next();
    }
  };
}
module.exports = optionalAuthentication;
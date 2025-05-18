const { validateToken } = require("../authService/authService");

function checkForAuthenticationCookie() {
  return (req, res, next) => {
    try {
      const authHeaders = req.headers["authorization"];
      const tokenCookieValue = authHeaders && authHeaders.split(" ")[1];

      if (!tokenCookieValue) {
        return res.status(400).json({ error: "No token found. Looks like you are not logged in." });
      }

      const userPayload = validateToken(tokenCookieValue);

      if (!userPayload) {
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      req.user = userPayload;
      next();
    } catch (error) {
      console.error("Error validating token:", error.message);
      return res.status(500).json({ error: "Authentication error!" });
    }
  };
}

module.exports = checkForAuthenticationCookie;

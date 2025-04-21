const {validateToken} = require("../authService/authService");
function checkForAuthenticationCookie() {
  return (req, res, next) => {
    try {
      const authHeaders = req.headers["authorization"];
      const tokenCookieValue = authHeaders && authHeaders.split(" ")[1];
      if (!tokenCookieValue) {
        res.status(400).json({ error: "No token found!" });
        return next();
      }
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      next();

    } catch (error) {
      console.error("error validating token ", error.message);
      return res.status(500).json({error:"Authentication error!"});
    }
  };
}

module.exports = checkForAuthenticationCookie;

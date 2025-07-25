const { serialize } = require("cookie");

const setTokenCookie = (res, token, middlewareToken) => {
  res.setHeader("Set-Cookie", [
    // Secure, HttpOnly cookie
    serialize("token", token, {
      domain:".favorselect.com",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 360, 
    }),
    // Non-HttpOnly for middleware
    serialize("token_middleware", middlewareToken, {
       domain:".favorselect.com",
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 360,
    }),
  ]);
};

module.exports = setTokenCookie;

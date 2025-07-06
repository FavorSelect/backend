const { serialize } = require("cookie");

const setTokenCookie = (res, token) => {
  res.setHeader("Set-Cookie", [
    // HttpOnly cookie for backend security
    serialize("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 360,
    }),

    // Accessible cookie for middleware
    serialize("token_middleware", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 360,
    }),
  ]);
};

module.exports = setTokenCookie;

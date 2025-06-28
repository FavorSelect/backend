const { serialize } = require("cookie");

const setTokenCookie = (res, token) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 360, 
    })
  );
};

module.exports = setTokenCookie;

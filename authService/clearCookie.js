const { serialize } = require("cookie");
const clearTokenCookie = (res) => {
  res.setHeader("Set-Cookie", serialize("token", "", {
    httpOnly: true,
    secure: false,       
    sameSite: "lax",      
    path: "/",            
    expires: new Date(0), 
  }));
};
module.exports = clearTokenCookie;

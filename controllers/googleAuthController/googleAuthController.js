const axios = require("axios");
const encrypt = require("../../authService/encrption");
const setTokenCookie = require("../../authService/setTokenCookie");
const jwt = require("jsonwebtoken");
const User = require("../../models/authModel/userModel");
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL_MAIN = process.env.FRONTEND_URL_MAIN;
const JWT_SECRET = process.env.JWT_SECRET;
const qs = require("querystring");

const redirectToGoogle = (req, res) => {
  const googleAuthURL =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid profile email`;
  res.redirect(googleAuthURL);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Authorization code missing" });
  }

  try {
    //Get the access token from Google
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;

    // Get user info from Google
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { sub: googleId, name, email, picture } = userResponse.data;

    const [firstName = "Google", ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "User";
    let user = await User.findOne({ where: { googleId } });

    if (user) {
      if (user.email !== email) {
        user.email = email;
        await user.save();
      }
    } else {
      user = await User.findOne({ where: { email } });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({
          googleId,
          firstName,
          lastName,
          email,
          profilePhoto: picture,
          password: null,
          isVerified: true,
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.firstName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    setTokenCookie(res, token);

    const userData = JSON.stringify({
      name: user.firstName + " " + user.lastName,
      email: user.email,
    });

    const encrypted = encrypt(userData);

    res.redirect(
      `${FRONTEND_URL_MAIN}/?data=${encodeURIComponent(encrypted)}`
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  googleCallback,
  redirectToGoogle,
};

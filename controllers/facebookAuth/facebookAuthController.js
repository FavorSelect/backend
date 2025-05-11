const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../../models/authModel/userModel'); 
require('dotenv').config();

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const redirectToFacebook = (req, res) => {
  const facebookAuthURL = `https://www.facebook.com/v19.0/dialog/oauth?` +
    `client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&response_type=code&scope=email,public_profile`;

  res.redirect(facebookAuthURL);
};

const facebookCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code missing' });
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
      params: {
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: FACEBOOK_REDIRECT_URI,
        code,
      },
    });

    const access_token = tokenRes.data.access_token;

    // Get user info
    const userRes = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email',
        access_token,
      },
    });
    const { id: facebookId, name, email } = userRes.data;
    const [firstName, lastName] = (name || '').split(' ');
    let user = await User.findOne({ where: { facebookId } });

if (!user) {
  user = await User.findOne({ where: { email } }); // Check if email already exists

  if (!user) {
    user = await User.create({
      facebookId,
      firstName: firstName || 'Facebook',
      lastName: lastName || 'User',
      email: email || null,
      password: null,
    });
  } else {
    // Link existing user to Facebook
    user.facebookId = facebookId;
    await user.save();
  }
}


    const token = jwt.sign(
      { userId: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`http://localhost:3000/?token=${token}`);
  } catch (error) {
    if (error.response?.data) {
      console.error("Facebook API Error:", error.response.data);
    } else {
      console.error("Unexpected Error:", error.message);
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  redirectToFacebook,
  facebookCallback,
};

const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../../models/authModel/userModel'); 
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const qs = require('querystring');

const redirectToGoogle = (req, res) => {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid profile email`;
    res.redirect(googleAuthURL);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code missing' });
  }

  try {
    // Get the access token from Google
    const response = await axios.post('https://oauth2.googleapis.com/token', 
      qs.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = response.data;

    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { sub: googleId, name, email, picture } = userResponse.data;
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      const [firstName, lastName] = (name || '').split(' ');

      user = await User.create({
        googleId,
        firstName: firstName || 'Google',
        lastName: lastName || 'User',
        email,
        profilePic: picture,
        password: null, 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(`http://localhost:3000/?token=${token}`);  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
    googleCallback,
    redirectToGoogle,
};

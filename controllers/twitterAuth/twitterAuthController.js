const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const querystring = require('querystring');
const oauth = require('oauth-1.0a');
const User = require('../../models/authModel/userModel');

require('dotenv').config();

const TWITTER_API_KEY = process.env.TWITTER_CLIENT_ID;
const TWITTER_API_SECRET_KEY = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const tokenStore = {}; // In-memory store for oauth_token_secret (should use Redis or DB in production)

const createOAuthClient = () => {
  return oauth({
    consumer: {
      key: TWITTER_API_KEY,
      secret: TWITTER_API_SECRET_KEY,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
  });
};

const redirectToTwitter = async (req, res) => {
  console.log('🔁 [Step 1] Redirecting to Twitter...');
  const oauthClient = createOAuthClient();

  const request_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: {
      oauth_callback: TWITTER_REDIRECT_URI,
    },
  };

  const headers = oauthClient.toHeader(oauthClient.authorize(request_data));
  console.log('🔐 OAuth Headers:', headers);

  try {
    const response = await axios.post(request_data.url, null, {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const parsed = querystring.parse(response.data);
    const oauth_token = parsed.oauth_token;
    const oauth_token_secret = parsed.oauth_token_secret;

    console.log('✅ Got request token, redirecting user...');

  
    tokenStore[oauth_token] = oauth_token_secret;

    const redirectUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}`;
    console.log('Redirecting to Twitter with URL:', redirectUrl);
    res.redirect(redirectUrl);
    
  } catch (err) {
    console.error(' Error fetching Twitter request token:', err.response?.data || err.message);
    res.status(500).json({ message: 'Error fetching request token' });
  }
};


const twitterCallback = async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;

  if (!oauth_token || !oauth_verifier) {
    console.error(' Missing required parameters', { oauth_token, oauth_verifier });
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  const oauth_token_secret = tokenStore[oauth_token];

  if (!oauth_token_secret) {
    console.error(' oauth_token_secret not found or expired');
    return res.status(400).json({ message: 'Token secret not found or expired' });
  }

  const oauthClient = createOAuthClient();

  const request_data = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
    data: {
      oauth_token,
      oauth_verifier,
    },
  };

  const headers = oauthClient.toHeader(
    oauthClient.authorize(request_data, {
      key: oauth_token,
      secret: oauth_token_secret,
    })
  );

  try {
    const response = await axios.post(request_data.url, null, {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const parsed = querystring.parse(response.data);

    const twitterId = parsed.user_id;
    const name = parsed.screen_name;
    const oauthAccessToken = parsed.oauth_token;
    const oauthAccessTokenSecret = parsed.oauth_token_secret;


    let user = await User.findOne({ where: { twitterId } });

    if (!user) {
      user = await User.create({
        twitterId,
        firstName: name,
        lastName: '',
        email: null,
        password: null,
      });
      console.log(' New user created');
    } else {
      console.log(' Existing user found');
    }

    const token = jwt.sign(
      { userId: user.id, name: `${user.firstName} ${user.lastName}` },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔐 JWT token generated:', token);

    delete tokenStore[oauth_token];

    res.redirect(`http://localhost:3000/?token=${token}`);
  } catch (err) {
    console.error(' Error exchanging Twitter token:', err.response?.data || err.message);
    return res.status(500).json({ message: 'Error logging in with Twitter' });
  }
};

module.exports = {
  redirectToTwitter,
  twitterCallback,
};

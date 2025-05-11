const express = require('express');
const { redirectToTwitter, twitterCallback } = require('../../controllers/twitterAuth/twitterAuthController');
const router = express.Router();


router.get('/twitter', redirectToTwitter);
router.get('/twitter/callback', twitterCallback);

module.exports = router;

const express = require('express');
const { redirectToFacebook, facebookCallback } = require('../../controllers/facebookAuth/facebookAuthController');

const router = express.Router();

router.get('/facebook', redirectToFacebook);
router.get('/facebook/callback', facebookCallback);

module.exports = router;

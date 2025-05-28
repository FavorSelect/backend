const express = require('express');
const { updateEmailPreferences } = require('../../controllers/advertiseController/promotionToUser/emailPrefrence');
const router = express.Router();


router.put('/email-preferences', updateEmailPreferences);

module.exports = router;

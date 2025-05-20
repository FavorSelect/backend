const express = require('express');
const { handleAddSellerFeedback, handleGetUserFeedbacks } = require('../../controllers/feedbackController/sellerFeedbackController');
const router = express.Router();


router.post('/feedback/add', handleAddSellerFeedback);
router.get('/feedback',  handleGetUserFeedbacks); 

module.exports = router;

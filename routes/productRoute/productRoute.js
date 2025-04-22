const express = require("express");
const router = express.Router();

router.get('/',getAllProduct);
router.get('/:productId',getOneProduct);

module.exports = router;

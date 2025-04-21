const express = require("express");
const { handleSignUp, handleSignin} = require("../controllers/userController");
const router = express.Router();

router.post("/signup",handleSignUp);
router.post("/signin", handleSignin);

module.exports = router;
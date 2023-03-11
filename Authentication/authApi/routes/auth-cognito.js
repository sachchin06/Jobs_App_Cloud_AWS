const express = require("express");
const router = express.Router();

const { signUp, signIn, confirmation } = require("../controllers/auth-cognito");

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/confirmation", confirmation);

module.exports = router;

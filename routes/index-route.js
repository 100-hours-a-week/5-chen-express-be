var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")


router.post('/login', users.login.validator, users.login.controller);

router.post('/signup', users.signup.validator, users.signup.controller)

module.exports = router;

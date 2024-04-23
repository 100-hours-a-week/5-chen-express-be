var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")
const {validate} = require("../controllers/validator");


router.post('/login', users.login.validator, validate, users.login.controller);

router.post('/signup', users.signup.validator, validate, users.signup.controller)

module.exports = router;

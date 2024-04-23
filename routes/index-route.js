var express = require('express');
const HttpStatus = require("http-status-codes")
const {body} = require("express-validator");
var router = express.Router();
const users = require("../controllers/user-controller")
const fs = require('fs');

/* GET home page. */
router.post('/login', users.login.validator, users.login.controller);

router.post('/signup', users.signup.validator, users.signup.controller)

module.exports = router;

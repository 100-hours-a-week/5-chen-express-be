var express = require('express');
const HttpStatus = require("http-status-codes");
const {body} = require("express-validator");
var router = express.Router();
const users = require("../controllers/user-controller")


/* GET users listing. */
router.get('/exist', users.exist.validator, users.exist.controller);

module.exports = router;

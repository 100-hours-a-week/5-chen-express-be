var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")


/* GET users listing. */
router.get('/exist', users.exist.validator, users.exist.controller);

module.exports = router;

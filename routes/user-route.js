var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")
const {validate} = require("../controllers/validator");


/* GET users listing. */
router.get('/exist', users.exist.validator, validate, users.exist.controller);

router.get('/me', users.me.validator, users.me.controller);

router.put('/me', users.update.validator, users.update.controller);

module.exports = router;

var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")
const {validate} = require("../controllers/validator");
const upload = require("./upload");


/* GET users listing. */
router.get('/exist', users.exist.validator, validate, users.exist.controller);

router.get('/me', users.me.validator, users.me.controller);

router.put('/me', upload.single("image"), users.update.validator, validate, users.update.controller);

router.put('/me/password', users.password.validator, validate, users.password.controller);

module.exports = router;

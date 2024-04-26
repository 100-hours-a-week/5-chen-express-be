var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")
const {validate} = require("../controllers/validator");
const upload = require("./upload");
const auth = require("./auth");


/* GET users listing. */
router.get('/exist', users.exist.validator, validate, users.exist.controller);

router.get('/me', auth, users.me.validator, users.me.controller);

router.put('/me', auth, upload.single("image"), users.update.validator, validate, users.update.controller);

router.put('/me/password', auth, users.password.validator, validate, users.password.controller);

module.exports = router;

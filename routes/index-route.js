var express = require('express');
var router = express.Router();
const users = require("../controllers/user-controller")
const {validate} = require("../controllers/validator");
const upload = require("./upload")


router.post('/login', users.login.validator, validate, users.login.controller);
router.post('/logout', users.logout.validator, validate, users.logout.controller);

router.post('/signup', upload.single("image"), users.signup.validator, validate, users.signup.controller)

module.exports = router;

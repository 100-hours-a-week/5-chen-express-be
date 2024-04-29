var express = require('express');
var router = express.Router();
const comments = require('../controllers/comment-controller')
const {validate} = require("../controllers/validator");
const auth = require("./auth")


router.get('/', auth, comments.list.validator, validate, comments.list.controller)

router.post('/', auth, comments.write.validator, validate, comments.write.controller)

router.post('/:id', auth, comments.update.validator, validate, comments.update.controller)

router.delete('/:id', auth, comments.delete.validator, validate, comments.delete.controller)


module.exports = router;

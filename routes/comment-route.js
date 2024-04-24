var express = require('express');
var router = express.Router();
const comments = require('../controllers/comment-controller')
const {validate} = require("../controllers/validator");


router.get('/', comments.list.validator, validate, comments.list.controller)

router.post('/', comments.write.validator, validate, comments.write.controller)

router.post('/:id', comments.update.validator, validate, comments.update.controller)

router.delete('/:id', comments.delete.validator, validate, comments.delete.controller)


module.exports = router;

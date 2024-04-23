const express = require('express');
const posts = require("../controllers/post-controller");
const {validate} = require("../controllers/validator")

const router = express.Router();

router.get('/', [], posts.list)

router.post('/', posts.write.validator, validate, posts.write.controller);

router.get('/:id', posts.detail.validator, validate, posts.detail.controller)

router.post('/:id', posts.update.validator, validate, posts.update.controller)

module.exports = router;

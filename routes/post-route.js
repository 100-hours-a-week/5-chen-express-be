const express = require('express');
const posts = require("../controllers/post-controller");
const {validate} = require("../controllers/validator")
const upload = require("./upload");
const auth = require("./auth")

const router = express.Router();

router.get('/', auth, posts.list.validator, validate, posts.list.controller)

router.post('/', auth, upload.single("file"), posts.write.validator, validate, posts.write.controller);

router.get('/:id', auth, posts.detail.validator, validate, posts.detail.controller)

router.post('/:id', auth, upload.single("file"), posts.update.validator, validate, posts.update.controller)

router.delete('/:id', auth, posts.delete.validator, validate, posts.delete.controller)

router.get('/:id/comments', auth, posts.comments.validator, validate, posts.comments.controller)

module.exports = router;

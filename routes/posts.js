var express = require('express');
const HttpStatus = require("http-status-codes")
const {body} = require("express-validator");
var router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
    const postData = jsonParse("posts.json");
    res.json(postData)
})

router.post('/', [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('image').trim(),
], (req, res) => {
    const postData = jsonParse("posts.json");
    const {title, content, image} = req.body;
    let nextId = 0;
    for (const post of postData.posts) {
        if (post.id > nextId) {
            nextId = post.id + 1;
        }
    }

    postData.posts.push(
        {
            "id": nextId,
            "title": title,
            "content": content,
            "like_count": 0,
            "comment_count": 0,
            "view_count": 0,
            "created_at": new Date().toISOString(),
            "author": {
                "nickname": "JohnDoe1985",
                "profile_image": "/images/snake.jpg"
            }
        }
    );

    fs.writeFileSync(jsonPath("posts.json"), JSON.stringify(postData), 'utf8');

    res.status(HttpStatus.CREATED);
    res.json({
        "msg": "created"
    });
});

router.post('/:id', [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('image').trim(),
], (req, res) => {
    const postData = jsonParse("posts.json");
    const {title, content, image} = req.body;
    const id = Number(req.params.id);

    let targetPost;
    let targetIndex;

    for (let i = 0; i < postData.posts.length; i++) {
        const post = postData.posts[i]
        console.log(post, id)
        if (post.id === id) {
            targetPost = post;
            targetIndex = i;
            break;
        }
    }
    console.log("#####");
    targetPost.title = title;
    targetPost.content = content;
    targetPost.image = image;
    console.log("#####");
    postData.posts[targetIndex] = targetPost;
    console.log("#####");
    fs.writeFileSync(jsonPath("posts.json"), JSON.stringify(postData), 'utf8');

    res.json({"msg": "ok"});
})

module.exports = router;

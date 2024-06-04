const HttpStatus = require("http-status-codes");
const {body, param} = require("express-validator");
const PostModel = require("../models/post-model");
const CommentModel = require("../models/comment-model");
const {StatusCodes} = require("http-status-codes");
const {post} = require("../models/comment-model");


module.exports = new class {
  comments = {
    validator: [param("id").trim().isNumeric()],
    controller: (req, res) => {
      const post_id = req.params.id;
      const sessionUser = req.session.user;

      const comments = CommentModel.findAllByPostId(post_id, sessionUser);

      res.json({
        comments: comments,
      });
    }
  }

  list = {
    validator: [],
    controller: (req, res) => {
      PostModel.all()
        .then(posts => {
          console.log(posts)
          return res.json({
            posts: posts
          });
        });
    }
  }

  detail = {
    validator: [
      param("id").trim().isNumeric(),
    ],
    controller: (req, res) => {
      const id = req.params.id;
      const sessionUser = req.session.user;

      PostModel.find(id)
        .then(post => {
          post.addViewCount();
          post.save();

          res.json({
            "post": post,
            "can": post.can(sessionUser),
          });
        });
    }
  }

  write = {
    validator: [
      body('title').trim().notEmpty(),
      body('content').trim().notEmpty(),
    ],
    controller: (req, res) => {
      const sessionUser = req.session.user;
      const {title, content} = req.body;
      const post = PostModel.create(title, content, req.file, sessionUser);

      post.save();

      res.status(HttpStatus.CREATED);

      res.json({
        "msg": "created",
        post: post
      });
    }
  }

  delete = {
    validator: [
      param("id").trim().isNumeric()
    ],
    controller: (req, res) => {
      const id = req.params.id;

      const sessionUser = req.session.user;
      PostModel.find(id)
        .then(post => {
          if (!post.can(sessionUser)) {
            res.status(StatusCodes.FORBIDDEN);
            res.json({
              msg: "FORBIDDEN",
              post: post
            })
          } else {
            post.delete();

            res.json({
              msg: "deleted",
              post: post
            })
          }
        })
    }
  }

  update = {
    validator: [
      param("id").trim().isNumeric(),
      body('title').trim().notEmpty(),
      body('content').trim().notEmpty(),
    ],
    controller: (req, res) => {
      const id = req.params.id;
      const {title, content} = req.body;
      const sessionUser = req.session.user;

      PostModel.find(id)
        .then(post => {
          if (!post.can(sessionUser)) {
            res.status(StatusCodes.FORBIDDEN);
            res.json({
              msg: "FORBIDDEN",
              post: post
            });
            return;
          }
          post.update(title, content, req.file);
          post.save();

          res.json({"msg": "ok"});
        });
    }
  }
}
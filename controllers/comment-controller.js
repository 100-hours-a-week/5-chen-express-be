const HttpStatus = require("http-status-codes");
const {body, param} = require("express-validator");
const CommentModel = require("../models/comment-model")


module.exports = new class {
    list = {
        validator: [],
        controller: (req, res) => {
            res.json({
                comments: CommentModel.all().sort((a, b) => b.id - a.id)
            })
        }
    }

    write = {
        validator: [
            body("post_id").trim().isNumeric(),
            body('content').trim().notEmpty()
        ],
        controller: (req, res) => {
            const sessionUser = req.session.user;
            const {content, post_id} = req.body;
            console.log(`POST ID :${post_id}`)

            const comment = CommentModel.create(content, sessionUser);
            comment.save()

            res.status(HttpStatus.CREATED);
            res.json({
                "msg": "created",
                "comment": comment,
            });
        }

    }

    update = {
        validator: [
            param("id").trim().isNumeric(),
            body('content').trim().notEmpty()
        ],
        controller: (req, res) => {
            const id = req.params.id
            const {content} = req.body;

            const comment = CommentModel.find(id);
            const sessionUser = req.session.user;
            comment.update(content,sessionUser)
            comment.save()

            res.json({
                "msg": "ok",
                comment: comment
            });
        }

    }
    delete = {
        validator: [param("id").trim().isNumeric()],
        controller: (req, res) => {
            const id = req.params.id

            const comment = CommentModel.find(id);
            comment.delete();

            res.json({
                msg: "ok",
            })
        }
    };
}
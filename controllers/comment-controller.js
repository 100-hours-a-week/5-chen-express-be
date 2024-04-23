const HttpStatus = require("http-status-codes");
const {body, param} = require("express-validator");
const CommentModel = require("../models/comment-model")


module.exports = new class {
    list = {
        validator: [],
        controller: (req, res) => {
            res.json({
                comments: CommentModel.all()
            })
        }
    }

    write = {
        validator: [
            body('content').trim().notEmpty()
        ],
        controller: (req, res) => {
            const {content} = req.body;

            const comment = CommentModel.create(content);
            comment.save()

            res.status(HttpStatus.CREATED);
            res.json({
                "msg": "created"
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
            comment.update(content)
            comment.save()

            res.json({"msg": "ok"});
        }

    }
}
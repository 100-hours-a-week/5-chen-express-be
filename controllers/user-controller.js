const HttpStatus = require("http-status-codes");
const {body, param, query} = require("express-validator");
const UserModel = require("../models/user-model");

const SERVER = "http://localhost:8080";

module.exports = new class {
    DUMMY_ID = 1;

    exist = {
        validator: [
            query("email").trim(),
            query("nickname").trim()
        ],
        controller: (req, res) => {
            const {nickname, email} = req.query;

            let emailCheck = false;
            let nicknameCheck = false;

            for (const user of UserModel.all()) {
                if (email !== undefined) {
                    emailCheck = emailCheck || (email === user.email);
                }
                if (nickname !== undefined) {
                    nicknameCheck = nicknameCheck || (nickname === user.nickname);
                }
            }

            res.json({
                "msg": "OK",
                "email_exist": emailCheck,
                "nickname_exist": nicknameCheck,
            });
        }
    }

    login = {
        validator: [
            body("email").trim(),
            body("password").trim()
        ],
        controller: (req, res) => {
            const {email, password} = req.body;

            for (const user of UserModel.all()) {
                if (user.email === email && user.password === password) {
                    res.json({
                        "msg": "login success"
                    });
                    return;
                }
            }

            res.status(HttpStatus.UNAUTHORIZED);
            res.json({
                "msg": "login failed"
            });
        }
    };

    signup = {
        validator: [
            body('email').trim().notEmpty(),
            body('password').trim().notEmpty(),
            body('nickname').trim().notEmpty(),
        ],
        controller: (req, res) => {
            console.log(req.body)
            console.log(req.file)
            const {email, password, nickname} = req.body;

            const terminateByDuplicated = resp => {
                resp.status(HttpStatus.BAD_REQUEST);
                resp.json({
                    "msg": "DUPLICATED"
                });
            };

            for (const user of UserModel.all()) {
                if (email === user.email) {
                    terminateByDuplicated(res);
                    return;
                }
                if (nickname === user.nickname) {
                    terminateByDuplicated(res);
                    return;
                }
            }
            let filePath = `${SERVER}/public/images/default.jpg`;
            if (req.file != null) {
                filePath = `${SERVER}/uploads/${req.file.filename}`;
            }
            const newUser = UserModel.create(email, password, nickname, filePath);
            newUser.save();

            res.json({
                "msg": "OK"
            });
        }
    };

    me = {
        validator: [],
        controller: (req, res) => {
            const user = UserModel.find(this.DUMMY_ID);
            res.json({
                "user": user
            });
        }
    };

    update = {
        validator: [
            body("nickname").trim(),
        ],
        controller: (req, res) => {
            const userId = this.DUMMY_ID;
            const user = UserModel.find(userId);
            let {nickname} = req.body;

            if (nickname === "" && req.file == null) {
                res.status(HttpStatus.BAD_REQUEST)
                res.json({
                    "msg": "Null Body"
                })
                return;
            }

            if (nickname !== "") {
                for (const user of UserModel.all()) {
                    if (user.nickname === nickname && user.id != userId) {
                        const terminateByDuplicated = resp => {
                            resp.status(HttpStatus.BAD_REQUEST);
                            resp.json({
                                "msg": "DUPLICATED"
                            });
                        };
                        terminateByDuplicated(res);
                        return;
                    }
                }
            } else {
                nickname = user.nickname;
            }

            let filePath = user.profile_image
            if (req.file != null) {
                filePath = `${SERVER}/uploads/${req.file.filename}`;
            }

            user.update(user.email, user.password, nickname, filePath);
            user.save();

            res.json({
                "msg": "successful update",
                "user": user
            });
        }
    };
    password = {
        validator: [
            body("password").trim().notEmpty(),
        ],
        controller: (req, res) => {
            const user = UserModel.find(this.DUMMY_ID);
            let {password} = req.body;

            user.update(user.email, password, user.nickname, user.profile_image);
            user.save();

            res.json({
                "msg": "successful update",
                "user": user
            });
        }
    }
}
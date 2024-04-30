const HttpStatus = require("http-status-codes");
const {body, param, query} = require("express-validator");
const UserModel = require("../models/user-model");

module.exports = new class {
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
                msg: "OK",
                email_exist: emailCheck,
                nickname_exist: nicknameCheck,
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
                    user.password = "secret";
                    req.session.user = user;

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

    logout = {
        validator: [],
        controller: (req, res) => {
            req.session.destroy();

            res.json({
                msg: "Logout success",
            })
        }
    }

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
            let filePath = "http://localhost:8080/public/images/default.jpg"
            if (req.file != null) {
                filePath = `http://localhost:8080/uploads/${req.file.filename}`;
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
            res.json({
                "user": req.session.user
            });
        }
    };

    update = {
        validator: [
            body("nickname").trim(),
        ],
        controller: (req, res) => {
            const sessionUser = req.session.user;
            let {nickname: inputNickname} = req.body;

            if (inputNickname === "" && req.file == null) {
                res.status(HttpStatus.BAD_REQUEST)
                res.json({
                    "msg": "Null Body"
                })
                return;
            }

            const userModel = UserModel.find(sessionUser.id)

            if (inputNickname !== "") {
                for (const user of UserModel.all()) {
                    if (user.nickname === inputNickname && user.id != sessionUser.id) {
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
                inputNickname = sessionUser.nickname;
            }

            let filePath = sessionUser.profile_image
            if (req.file != null) {
                filePath = `http://localhost:8080/uploads/${req.file.filename}`;
            }

            userModel.update(sessionUser.email, sessionUser.password, inputNickname, filePath);
            userModel.save();

            res.json({
                "msg": "successful update",
                "user": sessionUser
            });
        }
    };
    password = {
        validator: [
            body("password").trim().notEmpty(),
        ],
        controller: (req, res) => {
            const sessionUser = req.session.user;
            const user = UserModel.find(sessionUser.id);
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
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
            const dummyId = 1;
            const user = UserModel.find(dummyId);
            res.json({
                "user": user
            });
        }
    };

    update = {
        validator: [
            body("nickname").trim(),
            body("password").trim(),
        ],
        controller: (req, res) => {
            const dummyId = 1;
            const {nickname, password} = req.body;


            for (const user of UserModel.all()) {
                if (user.nickname === nickname) {
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

            const user = UserModel.find(dummyId);
            user.update(user.email, password, nickname);
            user.save();

            res.json({
                "msg": "successful update",
                "user": user
            });
        }
    };
}
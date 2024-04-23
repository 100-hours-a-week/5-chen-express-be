const HttpStatus = require("http-status-codes");
const {body, param} = require("express-validator");
const UserModel = require("../models/user-model");


module.exports = new class {
    exist = {
        validator: [body("email").trim(), body("nickname").trim()],
        controller: (req, res) => {
            const {nickname, email} = req.body
            const userAll = UserModel.all();

            let emailCheck = false;
            let nicknameCheck = false;

            for (const user of userAll) {
                if (email !== undefined) {
                    emailCheck = emailCheck || (email === user.email);
                }
                if (nickname !== undefined) {
                    nicknameCheck = nicknameCheck || (nickname === user.nickname);
                }
            }


            res.json({
                "msg": "OK",
                "email-exist": emailCheck,
                "nickname-exist": nicknameCheck,
            })
        }
    }
}
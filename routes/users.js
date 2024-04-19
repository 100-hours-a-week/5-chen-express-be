var express = require('express');
const HttpStatus = require("http-status-codes");
const {body} = require("express-validator");
var router = express.Router();

/* GET users listing. */
router.get('/exist', [body("email").trim(), body("nickname").trim()], function (req, res, next) {
    let data = jsonParse("users.json");
    const users = data.users
    const {nickname, email} = req.body

    if (nickname === "" && email === "") {
        res.status(HttpStatus.BAD_REQUEST)
        res.json({
            "msg": "BAD REQUEST",
        })
        return;
    }

    let emailCheck = false;
    let nicknameCheck = false;

    for (const user of users) {
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
});

module.exports = router;

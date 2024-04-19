var express = require('express');
const HttpStatus = require("http-status-codes")
const {body} = require("express-validator");
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.post('/login', [
        body("email").trim(),
        body("password").trim()
    ],
    (req, res) => {
        const usersData = jsonParse("users.json");
        for (user of usersData.users) {
            if (user.email === req.body.email && user.password === req.body.password) {
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
    });

router.post('/signup', [
        body('email').trim(),
        body('password').trim(),
        body('nickname').trim()
    ], (req, res) => {
        const userData = jsonParse("users.json");
        const users = userData.users;

        const {email, password, nickname} = req.body;

        const terminateByDuplicated = resp => {
            resp.status(HttpStatus.BAD_REQUEST);
            resp.json({
                "msg": "DUPLICATED"
            });
        };

        let nextId = 0;
        for (const user of users) {
            if (email === user.email) {
                terminateByDuplicated(res);
                return;
            }
            if (nickname === user.nickname) {
                terminateByDuplicated(res);
                return;
            }
            if (user.id > nextId) {
                nextId = user.id;
            }
        }

        userData.users.push({
            "id": nextId,
            "email": email,
            "password": password,
            "nickname": nickname
        });

        fs.writeFileSync(
            jsonPath("users.json"),
            JSON.stringify(userData),
            'utf8'
        );

        res.json({
            "msg": "OK"
        });
    }
)

module.exports = router;

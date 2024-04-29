const HttpStatus = require("http-status-codes");

module.exports = (req, res, next) => {
    if (req.session.user == undefined) {
        res.status(HttpStatus.UNAUTHORIZED);
        res.json({
            msg: "MUST LOGGED IN",
        });
        console.log("##### NOT LOGGED IN");
        return;
    } else {
        const user = req.session.user;
        console.log(`##${req.session.id}## USER : ${user.id} ${user.nickname} ${user.email}`)
    }

    next();
}



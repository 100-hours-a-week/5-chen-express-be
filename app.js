const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const fs = require('fs');

const indexRouter = require('./routes/index-route');
const usersRouter = require('./routes/user-route');
const postsRouter = require('./routes/post-route');
const commentsRouter = require('./routes/comment-route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

global.jsonPath = (...paths) => {
    const p = ["json"].concat(paths);
    return path.resolve(...p);
};

global.jsonWrite = (path, data) => {
    fs.writeFileSync(jsonPath(path), JSON.stringify(data), 'utf8');
}

global.jsonParse = (...paths) => {
    return JSON.parse(fs.readFileSync(jsonPath(...paths), 'utf8'))
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

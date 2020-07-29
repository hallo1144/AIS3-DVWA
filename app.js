var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var Counter = require('./api/tools/Counter');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var db_options = require('./api/tools/DbOptions.json');
var session_options = require('./api/tools/SessionOptions.json');
var fileupload = require("express-fileupload");

var APIRouter = require('./api/Route');

var app = express();

// needed for image upload
app.use(fileupload());

// setup session
var sessionStore = new MySQLStore(db_options);
session_options.store = sessionStore;
app.use(session(session_options));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use('/api', APIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(req.url)
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.log(err)
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

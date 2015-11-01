var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var contents = require('./routes/contents');
var thumbnails = require('./routes/thumbnails');
var store = require('./routes/store');
var survey = require('./routes/survey');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req,res,next){
	res.header("Access-Control_Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
app.options('*', function(req,res,next){
	res.end();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/contents', contents);
app.use('/thumbnails', thumbnails);
app.use('/store', store);
app.use('/survey', survey);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

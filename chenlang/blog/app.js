var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
//打印日志模块
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var article = require('./routes/article');

var app = express();
app.use(session({
  secret: 'come',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: require('./dbUrl').dbUrl
  })
}));
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.keyword = req.session.keyword;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
      next();
})

app.use('/', index);
app.use('/users', users);
app.use('/article',article);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //可传给所有引擎文件
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

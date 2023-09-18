var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
const {mongoose} = require('mongoose');
var upload = require('multer');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

mongoose.connect("mongodb+srv://adarshjayasanker5:grnx@cluster0.jgd95md.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser : true,
  useUnifiedTopology : true,
}).then(()=>{
  console.log('connected to MongoDB');
}).catch((error)=>{
  console.log('mongodb error :' ,error);
});

app.use('/admin', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

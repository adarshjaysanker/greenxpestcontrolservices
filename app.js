var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));


app.use(session({
  secret : 'greenxsecret',
  resave : false,
  saveUninitialized : true
}))




mongoose.connect("mongodb+srv://adarshjayasanker5:grnx@cluster0.jgd95md.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser : true,
  useUnifiedTopology : true,
}).then(()=>{
  console.log('connected to MongoDB');
}).catch((error)=>{
  console.log('mongodb error :' ,error);
});


app.use('/admin', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
// Import necessary modules and configure your app

// Your other routes and middleware go here

// Define a route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).render('admin/404'); // Render your custom 404 page
});



module.exports = app;

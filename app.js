// Dependencies
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ValError = require('./validation/ValError');
const ejsMate = require('ejs-mate');
var methodOverride = require('method-override');
const campRoute = require('./routes/campRoutes');
const cudRoute = require('./routes/cudRoutes');
const authRoute = require('./routes/authRoutes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./Models/userDB');
const LocalStrategy = require('passport-local');
const checkReturnTo = require('./validation/auth/checkReturnTo');
const mongoSantize = require('express-mongo-sanitize');

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname , 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/config'));

app.engine('ejs', ejsMate);
app.use(express.static('assets'))
app.use(mongoSantize());
app.use(session({
  name: 'session',
  secret: 'secreteforsession',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires : Date.now() * 1000 * 60 * 60 * 24 * 7,
    httpOnly : true,
    // secure: true(for production)
    maxAge : 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      next();
});

app.use(checkReturnTo);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

app.use('/viewcamps' , campRoute)
app.use('/' , cudRoute);
app.use('/' , authRoute);


db.on('error', () => {
    console.log("DB connection fail")
  });
db.once('open', () => {
    console.log("DB connection succes")
  });


app.listen(5000 , ()=>{
    console.log('server is started!')
})


app.all('*' , (err, req, res, next) => {
       next(new ValError('Page Not Found :(' , 400))
})

app.use((err , req , res , next)=>{
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('campgrounds/error', { err })
})






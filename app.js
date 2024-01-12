// Dependencies
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
const User = require('./DB/userDB');


app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname , 'views'));
app.engine('ejs', ejsMate);
app.use(express.static('assets')) 

app.use(session({
  secret: 'secreteforsession',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires : Date.now() * 1000 * 60 * 60 * 24 * 7,
    httpOnly : true,
    maxAge : 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/viewcamps' , campRoute)
app.use('/' , cudRoute);
app.use('/' , authRoute);

app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;


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





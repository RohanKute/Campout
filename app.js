// Dependencies
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./DB/campgroundDB');
const Review = require('./DB/reviewDB');
const bodyParser = require('body-parser');
const ValError = require('./validation/ValError');
const  {validateAsycFn} = require('./validation/ValidationAsync');
const  {validateSchema , validateReviewSchema}  = require('./validation/SchemaValidate');
const ejsMate = require('ejs-mate');
var methodOverride = require('method-override');
const campRoute = require('./routes/campRoutes');
const cudRoute = require('./routes/cudRoutes');
const session = require('express-session');
const flash = require('connect-flash');

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname , 'views'));
app.engine('ejs', ejsMate);
app.use(express.static('assets')) 

app.use(session({
  secret: 'secreteforsession',
  resave: false,
  saveUninitialized: true,
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
// connecting to DB 'yelp_camp'
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

// DB connection object
const db = mongoose.connection;

//then catch since "fn" is Aysnc 

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





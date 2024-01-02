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
const engine = require('ejs-mate');
var methodOverride = require('method-override');


app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname , 'views'));
app.engine('ejs', engine);
app.use(express.static('assets')) 
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

app.get('/' , (req , res) =>{
    res.render('home');
})

app.listen(5000 , ()=>{
    console.log('server is started!')
})


app.get('/viewcamps' , async(req , res)=>{
    const campgrounds =  await Campground.find({});
    res.render('campgrounds/viewcamps' , {campgrounds});
})

app.get('/viewcamps/campdetails/:id' , async(req , res)=>{
  const id = req.params.id;
  let campground =  await Campground.findById(id);
  campground = await campground.populate('review');
  res.render('campgrounds/campdetails' , {campground});
});


app.post('/viewcamps/campdetails/:id/review' , validateReviewSchema, validateAsycFn(async(req , res)=>{
  const id = req.params.id;
  const review = new Review(req.body);
  await review.save();
  let campground =  await Campground.findByIdAndUpdate(id , { $push: { review: review._id }});
  campground.save();;
  res.redirect(`/viewcamps/campdetails/${id}`);
}));

app.get('/viewcamps/createnew' , async (req ,res) => {
   res.render('campgrounds/createnew');
});

app.post('/savecamp' ,validateSchema, (async (req , res , next)=>{  
              const newCamp = new Campground(req.body);
              await newCamp.save();
              res.redirect('/viewcamps');
  
}));

app.get('/editcamp/:id' , async (req ,res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/editcamp' , {campground});
});

app.put('/updatecamp/:id' , validateSchema, validateAsycFn(async (req , res , next) =>{
        await Campground.findByIdAndUpdate(req.params.id,req.body);
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
}))

app.all('*' , (err, req, res, next) => {
       next(new ValError('Page Not Found :(' , 400))
})

app.use((err , req , res , next)=>{
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('campgrounds/error', { err })
})

app.delete('/deletecamp/:id' , async (req , res) =>{
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect(`/viewcamps`);
});


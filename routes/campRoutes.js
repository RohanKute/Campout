const express = require('express')
const router = express.Router();


const Campground = require('../DB/campgroundDB');
const Review = require('../DB/reviewDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  {validateSchema , validateReviewSchema}  = require('../validation/SchemaValidate');


router.get('/' , async(req , res)=>{
      const campgrounds =  await Campground.find({});
      res.render('campgrounds/viewcamps' , {campgrounds});
})

router.get('/campdetails/:id' , async(req , res)=>{
      const id = req.params.id;
      let campground =  await Campground.findById(id);
      campground = await campground.populate('review');
      res.render('campgrounds/campdetails' , {campground});
});


router.post('/campdetails/:id/review' , validateReviewSchema, validateAsycFn(async(req , res)=>{
      const id = req.params.id;
      const review = new Review(req.body);
      await review.save();
      let campground =  await Campground.findByIdAndUpdate(id , { $push: { review: review._id }});
      campground.save();;
      req.flash('success' , 'Successfully added Review!')
      res.redirect(`/viewcamps/campdetails/${id}`);
}));

router.get('/createnew' , async (req ,res) => {
  res.render('campgrounds/createnew');
});

module.exports = router;





























































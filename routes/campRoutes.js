const express = require('express')
const router = express.Router();


const Campground = require('../Models/campgroundDB');
const Review = require('../Models/reviewDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  {validateSchema , validateReviewSchema}  = require('../validation/SchemaValidate');
const { IsLoggedIn  } = require('../validation/auth/Islogged');



router.get('/' , async(req , res)=>{
      const campgrounds =  await Campground.find({});
      res.render('campgrounds/viewcamps' , {campgrounds});
})

router.get('/campdetails/:id' , async(req , res)=>{
      const id = req.params.id;
      console.log(id);
      let campground =  await Campground.findById(id);
      campground = await campground.populate({
            path: 'review',
            populate: {
              path: 'author' 
            }
          })
      campground = await campground.populate('author');
      res.render('campgrounds/campdetails' , {campground});
});


router.post('/campdetails/:id/review', IsLoggedIn, validateReviewSchema, validateAsycFn(async(req , res)=>{
      const id = req.params.id;
      const review = new Review(req.body);
      review.author = req.user._id;
      await review.save();
      let campground =  await Campground.findByIdAndUpdate(id , { $push: { review: review._id }});
      campground.save()
      req.flash('success' , 'Successfully added Review!')
      res.redirect(`/viewcamps/campdetails/${id}`);
}));

router.get('/createnew' , IsLoggedIn ,async (req ,res) => {
      res.render('campgrounds/createnew');
});

module.exports = router;





























































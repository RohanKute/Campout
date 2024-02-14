const express = require('express')
const router = express.Router();


const Campground = require('../Models/campgroundDB');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  {validateSchema}  = require('../validation/SchemaValidate');
const { IsLoggedIn, storeReturnTo  } = require('../validation/auth/Islogged');
const isAuthorCamp = require('../validation/auth/isAuthorCamp');
const Review = require('../Models/reviewDB');
const isAuthorReview = require('../validation/auth/isAuthorReview');


router.post('/savecamp' , IsLoggedIn , validateSchema, (async (req , res , next)=>{  
          const newCamp = new Campground(req.body);
          newCamp.author = req.user._id
          await newCamp.save();
          req.flash('success' , 'Added new camp successfully');
          res.redirect('/viewcamps');
  
}));

router.get('/editcamp/:id' , IsLoggedIn , isAuthorCamp ,async (req ,res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/editcamp' , {campground});
});

router.put('/updatecamp/:id' , IsLoggedIn, isAuthorCamp , validateSchema, validateAsycFn(async (req , res , next) =>{
        await Campground.findByIdAndUpdate(req.params.id,req.body);
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
}))

router.delete('/deletecamp/:id' , IsLoggedIn , isAuthorCamp, async (req , res) =>{
      await Campground.findByIdAndDelete(req.params.id);
      req.flash('success', 'Successfully deleted campground!');
      res.redirect(`/viewcamps`);
});

router.delete('/deletereview/:id' , IsLoggedIn , storeReturnTo, isAuthorReview, async (req , res) =>{
        await Review.findByIdAndDelete(req.params.id);
        const review = await Review.find();
        req.flash('success', 'Successfully deleted Review!');
        const redirectUrl = res.locals.returnTo || '/viewcamps';
        delete res.locals.returnTo;
        res.redirect(redirectUrl);
  });
module.exports = router;


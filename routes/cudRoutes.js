const express = require('express')
const router = express.Router();


const Campground = require('../DB/campgroundDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  {validateSchema , validateReviewSchema}  = require('../validation/SchemaValidate');


router.post('/savecamp' ,validateSchema, (async (req , res , next)=>{  
          const newCamp = new Campground(req.body);
          await newCamp.save();
          req.flash('success' , 'Added new camp successfully');
          res.redirect('/viewcamps');
  
}));

router.get('/editcamp/:id' , async (req ,res) => {
        const campground = await Campground.findById(req.params.id);
        req.flash('success' , 'Edited the camp succesfully');
        res.render('campgrounds/editcamp' , {campground});
});

router.put('/updatecamp/:id' , validateSchema, validateAsycFn(async (req , res , next) =>{
        await Campground.findByIdAndUpdate(req.params.id,req.body);
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
}))

router.delete('/deletecamp/:id' , async (req , res) =>{
      await Campground.findByIdAndDelete(req.params.id);
      req.flash('success', 'Successfully deleted campground!');
      res.redirect(`/viewcamps`);
});

router.get('/login' , (req , res) =>{
          res.render('campgrounds/login');
})

router.get('/signup' , (req , res) =>{
        res.render('campgrounds/signup');
})
module.exports = router;


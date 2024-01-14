const express = require('express')
const router = express.Router();


const Campground = require('../DB/campgroundDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  {validateSchema , validateReviewSchema}  = require('../validation/SchemaValidate');
const { IsLoggedIn  } = require('../validation/auth/Islogged');


      
router.post('/savecamp' , IsLoggedIn ,validateSchema, (async (req , res , next)=>{  
          const newCamp = new Campground(req.body);
          await newCamp.save();
          req.flash('success' , 'Added new camp successfully');
          res.redirect('/viewcamps');
  
}));

router.get('/editcamp/:id' , IsLoggedIn ,async (req ,res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/editcamp' , {campground});
});

router.put('/updatecamp/:id' , IsLoggedIn, validateSchema, validateAsycFn(async (req , res , next) =>{
        await Campground.findByIdAndUpdate(req.params.id,req.body);
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
}))

router.delete('/deletecamp/:id' , IsLoggedIn , async (req , res) =>{
      await Campground.findByIdAndDelete(req.params.id);
      req.flash('success', 'Successfully deleted campground!');
      res.redirect(`/viewcamps`);
});

module.exports = router;


const express = require('express')
const router = express.Router();


const Campground = require('../DB/campgroundDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const  {validateSchema , validateReviewSchema}  = require('../validation/SchemaValidate');


router.post('/savecamp' ,validateSchema, (async (req , res , next)=>{  
              const newCamp = new Campground(req.body);
              await newCamp.save();
              res.redirect('/viewcamps');
  
}));

router.get('/editcamp/:id' , async (req ,res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/editcamp' , {campground});
});

router.put('/updatecamp/:id' , validateSchema, validateAsycFn(async (req , res , next) =>{
        await Campground.findByIdAndUpdate(req.params.id,req.body);
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
}))

router.delete('/deletecamp/:id' , async (req , res) =>{
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect(`/viewcamps`);
});

module.exports = router;


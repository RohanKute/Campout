const express = require('express')
const router = express.Router();
const app = express();

const User = require('../DB/userDB');
const Campground = require('../DB/campgroundDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');

router.get('/login' , (req , res) =>{
          res.render('campgrounds/login');
})

router.get('/signup' , async(req , res) =>{
        res.render('campgrounds/signup');
})

router.post('/signup' ,validateAsycFn( async (req , res ) =>{
   console.log(req.body)
   try {
    const { email , username , password} = req.body;
    const newUser = new User({email , username});
    await User.register(newUser , password);
        req.flash('success' , 'Welcome to CampOut!');
        res.redirect('/viewcamps');
    
   } catch (error) {
        req.flash('error' , error.message);
        res.redirect('/signup');
   }
}));

module.exports = router;



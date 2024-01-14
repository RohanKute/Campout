const express = require('express')
const router = express.Router();
const app = express();

const User = require('../DB/userDB');
const Campground = require('../DB/campgroundDB');
const bodyParser = require('body-parser');
const  {validateAsycFn} = require('../validation/ValidationAsync');
const passport  = require("passport");
const { IsLoggedIn , storeReturnTo } = require('../validation/auth/Islogged');


router.get('/login' , (req , res) =>{
          res.render('campgrounds/login');
})

router.get('/signup' , async(req , res) =>{
        res.render('campgrounds/signup');
})

router.post('/signup' ,validateAsycFn( async (req , res , next) =>{
   try {
     const { email , username , password} = req.body;
     const newUser = new User({email , username});
     const registeredUser = await User.register(newUser , password);
     req.login(registeredUser , (err) =>{
          if (err) return next(err);
          req.flash('success' , 'Welcome to CampOut!');
          res.redirect('/viewcamps');
     }) 
   }catch (error) {
     req.flash('error' , error.message);
     res.redirect('/signup');
   }
}));

router.post('/login', storeReturnTo, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {

       req.flash('success' , 'Welcome back!');
       const redirectUrl = res.locals.returnTo || '/viewcamps';
       delete res.locals.returnTo;
       res.redirect(redirectUrl);
  });


router.get('/logout' , (req, res, next) =>{
          req.logout(function (err) {
          if (err) {
              return next(err);
          }
          req.flash('success', 'Goodbye!');
          res.redirect('/viewcamps')
     });
})
module.exports = router;



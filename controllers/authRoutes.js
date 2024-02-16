const User = require('../Models/userDB');
const passport  = require("passport");



module.exports.signUpUser = async (req , res , next) =>{
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
};
 
module.exports.authenticateUser = passport.authenticate('local', { failureRedirect: '/login', failureFlash: true });

module.exports.loginUser = function(req, res) {
            req.flash('success' , 'Welcome back!');
            const redirectUrl = res.locals.returnTo || '/viewcamps';
            delete res.locals.returnTo;
            res.redirect(redirectUrl);
};


module.exports.logoutnUser =  (req, res, next) =>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/viewcamps')
   });
};
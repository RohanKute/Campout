
module.exports.IsLoggedIn = (req , res , next)=>{
        if (!req.isAuthenticated()){
              req.flash('error' , 'You need to login first!');
              return res.redirect('/login');
        }
        next();
}

module.exports.storeReturnTo = (req, res, next) => {
      if (req.session.returnTo) {
          res.locals.returnTo = req.session.returnTo;
      }
      next();
  }
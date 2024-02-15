
const Campground = require('../Models/campgroundDB');
const Review = require('../Models/reviewDB');


module.exports.saveCamp = async (req , res , next)=>{  
          const newCamp = new Campground(req.body);
          newCamp.author = req.user._id
          await newCamp.save();
          req.flash('success' , 'Added new camp successfully');
          res.redirect('/viewcamps');
  
};

module.exports.loadEditCampPage = async (req ,res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/editcamp' , {campground});
};

module.exports.updateCamp = async (req , res , next) =>{
        await Campground.findByIdAndUpdate(req.params.id,req.body);
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
};
module.exports.deleteCamp = async (req , res) =>{
      await Campground.findByIdAndDelete(req.params.id);
      req.flash('success', 'Successfully deleted campground!');
      res.redirect(`/viewcamps`);
};

module.exports.deleteReview =  async (req , res) =>{
        await Review.findByIdAndDelete(req.params.id);
        const review = await Review.find();
        req.flash('success', 'Successfully deleted Review!');
        const redirectUrl = res.locals.returnTo || '/viewcamps';
        delete res.locals.returnTo;
        res.redirect(redirectUrl);
 };

const Campground = require('../../Models/campgroundDB');

module.exports = async function isAuthorCamp(req , res ,next) {
    const campground = await Campground.findById(req.params.id);
    if(!campground.author._id.equals(res.locals.currentUser._id)){
           req.flash('error', 'You are not allowed to do that!');
           return res.redirect(`/viewcamps/campdetails/${req.params.id}`);
    }
    next();
}
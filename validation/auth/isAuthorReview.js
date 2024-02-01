const Review = require('../../DB/reviewDB');

module.exports = async function isAuthorCamp(req , res ,next) {
    const review = await Review.findById(req.params.id);
    if(!review.author._id.equals(res.locals.currentUser._id)){
           req.flash('error', 'You are not allowed to do that!');
           return res.redirect(`/viewcamps/campdetails/${req.params.id}`);
    }
    next();
}
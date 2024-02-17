const Campground = require('../Models/campgroundDB');
const Review = require('../Models/reviewDB');



module.exports.renderCamps = async(req , res)=>{
      const campgrounds =  await Campground.find({});
      res.render('campgrounds/viewcamps' , {campgrounds});
}
module.exports.showCamp = async(req , res)=>{
      const id = req.params.id;
      let campground =  await Campground.findById(id);
      campground = await campground.populate({
            path: 'review',
            populate: {
              path: 'author' 
            }
          })
      campground = await campground.populate('author');
      campground = await campground.populate('image');
      res.render('campgrounds/campdetails' , {campground});
};


module.exports.createReview = async(req , res)=>{
      const id = req.params.id;
      const review = new Review(req.body);
      review.author = req.user._id;
      await review.save();
      let campground =  await Campground.findByIdAndUpdate(id , { $push: { review: review._id }});
     campground.save()
      req.flash('success' , 'Successfully added Review!')
      res.redirect(`/viewcamps/campdetails/${id}`);
};

module.exports.loadCreatePage = async (req ,res) => {
      res.render('campgrounds/createnew');
};































































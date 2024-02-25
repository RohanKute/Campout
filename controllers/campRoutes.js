const { default: mongoose } = require('mongoose');
const Campground = require('../Models/campgroundDB');
const Review = require('../Models/reviewDB');
const ValError = require('../validation/ValError');



module.exports.renderCamps = async(req , res)=>{
      const campgrounds =  await Campground.find({});
      res.render('campgrounds/viewcamps' , {campgrounds});
}
module.exports.showCamp = async(req , res)=>{
      const id = req.params.id;
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if(isValid){
            let campground =  await Campground.findById(id);
            campground = await campground.populate({
                  path: 'review',
                  populate: {
                    path: 'author' 
                  }
                })
            campground = await campground.populate('author');
            campground = await campground.populate('image');
            return res.render('campgrounds/campdetails' , {campground});
      }
      res.render('campgrounds/invalidPage');
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































































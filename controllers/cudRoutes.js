const Campground = require('../Models/campgroundDB');
const Review = require('../Models/reviewDB');
const { cloudinary } = require('../config/cloudinaryConfig');
const { getGeoCodeData } = require('../config/mapBox');

module.exports.saveCamp = async (req , res , next)=>{  
        const newCamp = new Campground(req.body);
        newCamp.author = req.user._id
        newCamp.image = req.files.map(img => ({url : img.path , imgName : img.filename}))
        const data= await getGeoCodeData(req.body.location)
        if(data.body.features.length){
                newCamp.geometry = data.body.features[0].geometry;
        } else{
                newCamp.geometry=  { type: 'Point', coordinates: [77.216721,28.644800] }
        }
        await newCamp.save();
        req.flash('success' , 'Added new camp successfully');
        res.redirect('/viewcamps');
};

module.exports.loadEditCampPage = async (req ,res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/editcamp' , {campground});
};

module.exports.updateCamp = async (req , res , next) =>{
        const newCamp=  await Campground.findByIdAndUpdate(req.params.id,req.body);
        const images = req.files.map(img => ({url : img.path , imgName : img.filename}))
        await newCamp.image.push(...images);
        if(req.body.imageSelect){
                 for (let imageFileName of req.body.imageSelect ) {
                        await cloudinary.uploader.destroy(imageFileName);     
                 }
                 await newCamp.updateOne({$pull: {image: {imgName: {$in : req.body.imageSelect}}}});
        }
        await newCamp.save();
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/viewcamps/campdetails/${req.params.id}`);
   
};
module.exports.deleteCamp = async (req , res) =>{
      const campground = await Campground.findById(req.params.id);
      if (campground.image) {
       for (let image of campground.image ) {
                await cloudinary.uploader.destroy(image.imgName);     
        }
       }
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

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const ImageSchema = new Schema({ 
        url : String,
        imgName : String
  
});

ImageSchema.virtual('thumbnail').get(function () {
      return this.url.replace('/upload' , '/upload/w_200')
});

const campgSchema = new Schema({
    title : String,
    price : Number,
    description : String,
    location: String,
    image: [ImageSchema],
    author :{
           type : Schema.Types.ObjectId,
           ref : 'User'
    },
    review :[ {
        type : Schema.Types.ObjectId, ref : 'Review'
    }]
})


module.exports = mongoose.model('Campground' , campgSchema);
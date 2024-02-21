
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const opts = {toJSON : {virtuals: true}};
const ImageSchema = new Schema({ 
        url : String,
        imgName : String
  
});


// {/* <a href="viewcamps/campdetails/${this._id}"><h3>${this.title}</h3></a> */}
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
    }],
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
},opts)

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload' , '/upload/w_200')
});

campgSchema.virtual('properties.popupText').get(function () {
          return `${this.title}`
});

campgSchema.virtual('properties.id').get(function () {
  return `${this._id}`
});
module.exports = mongoose.model('Campground' , campgSchema);
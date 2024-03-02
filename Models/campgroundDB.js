
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = {toJSON : {virtuals: true}};
const ImageSchema = new Schema({ 
        url : String,
        imgName : String
  
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
  return this.url.replace('/upload' , '/upload/w_500')
});

campgSchema.virtual('properties.popupText').get(function () {
          return `${this.title}`
});

campgSchema.virtual('properties.id').get(function () {
  return `${this._id}`
});
module.exports = mongoose.model('Campground' , campgSchema);
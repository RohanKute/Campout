
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const reviewSchema = new Schema({
      rating : Number,
      reviewDescp : String
})

module.exports = mongoose.model('Review', reviewSchema);
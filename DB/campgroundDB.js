
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const campgSchema = new Schema({
    title : String,
    price : Number,
    description : String,
    location: String,
    image: String,
    review : [{
        type : Schema.Types.ObjectId, ref : 'Review'
    }]
})


module.exports = mongoose.model('Campground' , campgSchema);
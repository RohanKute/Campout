const mongoose = require('mongoose');
const Campground = require('../DB/campgroundDB')
const cities = require('./cities');
const {descriptors , places} = require('./helpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', () => {
    console.log("DB connection fail")
  });
db.once('open', () => {
    console.log("DB connection succes")
  });

const getTitle = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 35; i++){
        const random1000 = Math.floor(Math.random()  * 1000);
        const newCamp = new Campground({
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title : `${getTitle(descriptors)} ${getTitle(places)}`,
            price : Math.floor(Math.random()  * 500),
            description : "Lorem ipsum dolor sit amet consectetur adipisicing  deleniti nam maxime",
            image: 'https://source.unsplash.com/collection/483251'
        });
        await newCamp.save();
    }
}
seedDB();



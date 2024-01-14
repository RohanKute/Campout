
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
// while signup username filed is checked for duplicate usernames , for duplicate email 
// logic needed to be written 
module.exports = mongoose.model('User', UserSchema);
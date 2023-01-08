const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true         // for setting up a validation middleware
    }
})

userSchema.plugin(passportLocalMongoose);// Adds the fields username and password, authenticate(), verification etc

const User = mongoose.model('User', userSchema);

module.exports = User;
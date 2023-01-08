const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating:{
        type: Number,
        min: [1,'rating must not be less than 1'],
        max: [5, 'rating must not exceed 5']
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

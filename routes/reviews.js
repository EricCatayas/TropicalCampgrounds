const express = require('express');
const {catchAsync} = require('../utilities/catchAsync');
const Review = require('../models/reviews');
const Campground = require('../models/campgrounds');
const updateCampground = require('../utilities/commonFunctions');
const {isLoggedIn, isReviewAuthorized, validateReview} = require('../middleware');
const router = express.Router({mergeParams: true});  // By def, router req.param is separated

router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(async(req,res)=>{    
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);  //since we prefixed w/ 'review' in the form
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
    })) 
    .get(catchAsync(async(req,res)=>{  
        res.render(`campgrounds/${req.params.id}`);
     }))
router.delete('/:reviewId', isLoggedIn, isReviewAuthorized, catchAsync(async(req,res,next)=>{  // TEMP: R: isReviewAuthorized middleware
    const {id, reviewId} = req.params;
    const result = await updateCampground(req.user._id, id,{$pull:{reviews:reviewId}}) // 'pull' out the review in campgrounds that has the id  
    if(result){
        req.flash('success', 'review has been deleted');
        await Review.findByIdAndDelete(reviewId);
    } 
        req.flash('error', 'Something went wrong');
        res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;
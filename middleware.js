const Review = require('./models/reviews');
const ExpressError = require('./utilities/expressError');
const {campgroundSchema, registrationSchema, reviewSchema} = require('./schemas');

module.exports.isLoggedIn = (req,res,next) => {                        // module.exports.isLoggedIn XX redirects to /register
    // Ex:  req.path = '/new', req.originalUrl = '/campgrounds/new'
    if(req.isAuthenticated()){
        next();
    } else {
        req.session.redirectTo = req.originalUrl;
        req.flash('error', 'You must be signed in to access the page');
        res.redirect('/user/login');
    }
}

module.exports.isAuthorized = (req,res,next) => {
    const {id, reviewId} = req.params;
    if(req.user._id){
        next();
    } else {
        req.flash('error', 'Sorry, action is forbidden');
        if(req.originalUrl)
             res.redirect(req.originalUrl) 
        res.redirect('/campgrounds');
    }
}
module.exports.isReviewAuthorized = async (req,res,next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);   //  TODO
    if( review.author.equals(req.user._id)){
        next();
    } else {
        req.flash('error', 'Sorry, action is forbidden');
        if(req.originalUrl)
             res.redirect(req.originalUrl) 
        res.redirect('/campgrounds');
    }
}

module.exports.validateCampground = (req,res,next) => {                  
    console.log(req.files);
    if(req.files){
    req.body.campground.images = [];
        for(let image of req.files){
            req.body.campground.images.push({url:image.path, filename:image.filename});
        }
    } 
    const {error} = campgroundSchema.validate(req.body);
    console.log(error);
    if(error){
        const message = error.details.map(e => e.message).join(',');
        throw new ExpressError(message, error.status);
    } else{
        next();
    }
}
// N: Destruct the objects upon importing i.e const {isLoggedIn} = require()

module.exports.validateUserRegistration = (req,res,next) => {
    const {error} = registrationSchema.validate(req.body);
    if(error){
        const message = error.details.map(e => e.message).join(',');
        req.flash('error', message);
        res.redirect('/user/register');  
        // throw new ExpressError(message, error.status);
    } else{
        next();
    } 
}
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(e => e.message).join(',');
        throw new ExpressError(message, error.status);
    } else {
        next();
    }
}
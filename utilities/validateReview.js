const Joi = require('joi');
const ExpressError = require('./expressError');

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    })
}).required();

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(e => e.message).join(',');
        throw new ExpressError(message, error.status);
    } else {
        next();
    }
}

module.exports = validateReview;
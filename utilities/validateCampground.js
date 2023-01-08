const baseJoi = require('joi');
const ExpressError = require('./expressError');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({ // Prob: Html will treat {"campgrounds":"<script>..</script>"} as a tag 
    type: 'string',           //       we're d: an extension for joi.string() called 'escapeHtml' -- 'sanitizes' string
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],         
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })  // Checks if the input !== sanitized output
                return clean;
            }
        }
    }
});

Joi = baseJoi.extend(extension);

const validateCampground = (req,res,next) => {                  
    const campgroundSchema = Joi.object({
        campground: Joi.object({                //pass in the keys nested
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0),
            images: Joi.array().items({url:Joi.string().required().escapeHTML(), filename:Joi.string().required().escapeHTML()}).max(5), /*  */
            description: Joi.string().required().escapeHTML(),
            location: Joi.string().required().escapeHTML()
        }).required()
    })
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

module.exports = validateCampground;

const baseJoi = require('joi');
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

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({                //pass in the keys nested
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        images: Joi.array().items({url:Joi.string().required().escapeHTML(), filename:Joi.string().required().escapeHTML()}).max(5), /*  */
        description: Joi.string().allow('').escapeHTML(),
        location: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.registrationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .escapeHTML(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .escapeHTML(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .escapeHTML(),

    repeat_password: Joi.ref('password')
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5),
    })
}).required();

// module.exports = campgroundSchema; XX



const Joi = require('joi');
const ExpressError = require('./expressError');

// N: Destruct the objects upon importing i.e const {isLoggedIn} = require()

const validateUserRegistration = (req,res,next) => {
    const registrationSchema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        repeat_password: Joi.ref('password')
    });
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
module.exports = validateUserRegistration;



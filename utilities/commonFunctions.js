const ExpressError = require("./expressError");
const Campground = require('../models/campgrounds');

/* commonFunctions.updateCampground()  err: is not a funcion. 
   const updateCampground = async function(user_id,campgroundId, body){  } */
const updateCampground = async (user_id,campgroundId, body) => {
    try{
    const campground = await Campground.findById(campgroundId);
    if(!campground) throw new ExpressError('Error: campground is not found', 500);
        await Campground.findByIdAndUpdate(campgroundId, body,{runValidators:true, new:true});
        return true;
    }catch(error){
        throw new ExpressError(error.message, 500);
    }
}
module.exports = updateCampground;
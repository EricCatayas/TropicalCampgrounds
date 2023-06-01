const {cloudinary} = require('../services/cloudinary');

module.exports.catchAsync = fn =>{
    return function(req,res,next){
        fn(req,res,next).catch( err => next(err));
    }
}

// Why Promise? To ensure that fn returns a promise or an object with a catch method. 
module.exports.catchRedirectToNew = (middleware) => {
    return async (req, res, next) => {
      try {
        await middleware(req, res, next);
      } catch (error) {
        
        if (req.files) {
            for (const file of req.files) {
              await cloudinary.uploader.destroy(file.filename);
            }
        }

        req.flash('error', error.message);
        res.redirect('/campgrounds/new');
      }
    };
  };
 /* 
  = (fn) => {
    return function(req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(async (err) => {
        // passing variables to View
        res.locals.errorMessage = err.message;
        // deleting photos
        if (req.files) {
          for (const file of req.files) {
            await cloudinary.uploader.destroy(file.filename);
          }
        }
        req.flash('error', err.message);
        res.redirect('/campgrounds/new');
      });
    };
  };
  */

const User = require('../models/user');

module.exports.register = async (req,res,next) => {  
    try{
        const {username, email, password} = req.body;
        const user = await new User({username, email});
        const registeredUser = await User.register(user, password);   // <--
        req.login(registeredUser, (err)=>{
            if(err) return next(err);
            req.flash('success', `Welcome to Chilli\'s, ${registeredUser.username}`);
            res.redirect('/campgrounds');
        })
    } catch (error){
        req.flash('error', error.message);
        res.redirect('/user/register');
    }
}
module.exports.renderLoginForm = (req,res)=>{   
    const {campgroundId} = req.query;
    if(campgroundId)
        req.session.redirectTo = `../campgrounds/${campgroundId}`;   // redirects to users/campgrounds/:id w/out '..'
    res.render('auth/login');
}
module.exports.login = (req, res) => { //<-- keepSessionInfo to keep session.redirectTo
    req.flash('success', 'Succesfully logged in!');
    const returnPath = req.session.redirectTo || '/campgrounds';  // if user was not redirected i.e redirectTo is null, use: '/campgrounds'  
    delete req.session.redirectTo;
    res.redirect(returnPath);
}
module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/campgrounds');
      });
}
// renderRegister,  register, ____login, login logout
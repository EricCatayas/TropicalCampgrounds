const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router();
const auth = require('../controllers/auth');
const passport = require('passport');
const {validateUserRegistration} = require('../middleware');

router.route('/register')
    .get((req,res)=>{ res.render('auth/register') })
    .post(validateUserRegistration,catchAsync(auth.register))

router.route('/login')
    .get(auth.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash:true, failureRedirect: '/user/login',keepSessionInfo:true }),auth.login)

router.route('/logout')
    .get(auth.logout)

module.exports = router;

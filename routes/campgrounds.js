const express = require('express');
const {catchAsync, catchRedirectToNew} = require('../utilities/catchAsync');
const {isLoggedIn, isAuthorized, validateCampground} = require('../middleware');
const multer  = require('multer');              // multiform-parser; urlencoded does not support form-data
const fs = require('fs');
const {storage} = require('../services/cloudinary');
const campgrounds = require('../controllers/campgrounds');
const router = express.Router();

const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('campground[image]'), catchRedirectToNew(validateCampground), campgrounds.createCampground)

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm))

router.route('/:id')
    .get( catchAsync(campgrounds.showDetails))
    .put(isLoggedIn, isAuthorized,  validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthorized, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthorized, catchAsync(campgrounds.renderEditForm))

router.route('/:id/images/:imageId')
    .delete(isLoggedIn, isAuthorized, catchAsync(campgrounds.deleteImage))
    .post(isLoggedIn, isAuthorized, upload.array('newImages'),catchAsync(campgrounds.uploadImage))
    // .get()  ADD: Edit image page


module.exports = router;
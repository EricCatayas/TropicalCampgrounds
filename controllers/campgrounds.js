const updateCampground = require('../utilities/commonFunctions');
const {cloudinary} = require('../services/cloudinary');
const Campground = require('../models/campgrounds');    
const ExpressError = require('../utilities/expressError');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocodeClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}
module.exports.createCampground = async (req,res,next)=>{   
    // (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400); Needs server-side handling && is not scalable. Solution: JOI api
    try{
        const newCampground = new Campground(req.body.campground); // R: new.ejs
        newCampground.images = req.files.map(f => ({url:f.path, filename: f.filename}));  // <-- N: Remove'Campgrounds/'
        newCampground.author = req.user._id;
        const response = await geocodeClient.forwardGeocode({
            query: newCampground.location,
            limit: 1
          }).send();
        if(!response.body.features.length) throw new ExpressError('Location was not found, please try again', 500); /// TODO error status
        newCampground.geolocation = response.body.features[0].geometry;
        await newCampground.save();
        req.flash('success', 'Campground has been successfully added');
        res.redirect(`/campgrounds/${newCampground._id}`);
    } catch(error){
        req.flash('error', error.message);
        res.redirect(`/campgrounds/new`); 
    }
}
module.exports.renderNewForm = async (req,res,next)=>{        //Express may treat new and :id as alike calls
    res.render('campgrounds/new');                                       // Must precede post('/')?
} 
module.exports.showDetails = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path: 'reviews', populate:{path:"author"}}).populate('author');  // nested populate
    if(!campground){
        throw new ExpressError('Campground is not found', 404);
    }
    res.render('campgrounds/details', {campground});
}
module.exports.updateCampground = async (req,res,next)=>{
    try{
        const {id} = req.params;
        const userId = req.user._id;
        // Need to work on this
        const result = await updateCampground(userId, id, req.body.campground); 
        if(result) res.redirect(`/campgrounds/${id}`);
    } catch(error){
        req.flash('error', error.message);
        res.redirect(`/campgrounds${req.params._id}/edit`); 
    }
}
module.exports.deleteCampground = async (req,res,next)=>{     
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    for(let i = 0; i < campground.images.length; i++){
        await cloudinary.uploader.destroy(campground.images[i].filename);
    }
    req.flash('success', 'Campground has been deleted');
    res.redirect('/campgrounds');
}
module.exports.renderEditForm = async (req,res,next)=>{ 
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        throw new ExpressError('Campground is not found', 404);
    }
    res.render('campgrounds/edit', {campground});
}
/* --------------- Image Related ------------------  */
module.exports.deleteImage = async (req,res)=>{
    const {id, imageId} = req.params;
    const campground = await Campground.findById(id);
    const index = campground.images.map(element=>{  
        return element._id.toString()
    }).indexOf(imageId);
    // const result =  await campground.images.findByIdAndDelete(imageId);
    if (index > -1) {  
        await cloudinary.uploader.destroy(campground.images[index].filename);
        campground.images.splice(index, 1);     // 2nd parameter means remove one item only
        req.flash('success', 'Image has been deleted');
        await campground.save();
        // TODO Delete image in Cloudinary
    } else { req.flash('error', 'Something went wrong');}
    res.redirect(`/campgrounds/${id}/edit`);
}
module.exports.uploadImage = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const newImages = req.files.map(img => ({url:img.path, filename:img.filename}));
    if(newImages.length){
        campground.images.push(...newImages);
        await campground.save();
        req.flash('success', 'Images have been added');
    } else {
        req.flash('error', 'Select images to upload');
    }
    res.redirect(`/campgrounds/${id}/edit`);
}

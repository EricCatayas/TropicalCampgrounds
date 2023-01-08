const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: 'dbgolykzg', 
    api_key: '684254839633751', 
    api_secret: 'Fzp6iAqd_uYqE-Isl-1knDDYX9U' 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'Campgrounds',
        allowedFormats: ['jpeg','png','jpg'], // supports promises as well
    }
});

module.exports = {storage, cloudinary};


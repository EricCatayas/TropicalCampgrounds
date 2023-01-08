const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const imageSchema = new Schema({
    url:String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_240');
})

const campgroundSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        min: [0,'Cannot set price below 0']
    },
    images:[{
        type: imageSchema,
    }],
    location:{
        type: String,
        required: true,
    },
    geolocation:{            // mongo supports GeoJson ()nality
        type:{               // if Schema, _id will be auto defined
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
        
}, {toJSON:{virtuals:true},toObject:{virtuals:true}}); //By def, virtuals will not be included when converting documents to Json

campgroundSchema.virtual('properties.popUpMarkup').get(function(){   // Invalid JSON Syntax!
    return `<a href=\\"/campgrounds/${this._id}\\">View ${this.title}</a><p>Location: ${this.location}</p><p>Coordinates: ${this.geolocation.coordinates}</p>`;
})
campgroundSchema.post('findOneAndDelete', async(data)=>{     // Mongoose middleware
    if(data){
        await Review.deleteMany({
            _id:{
                $in:data.reviews    // ids wherein they're 'in' the farm products
            }
        });               
    }
})


const Campground = mongoose.model('Campground',campgroundSchema);

module.exports = Campground;

// https://api.unsplash.com/photos/random?client_id=reW-_0Lo8p2ElraTNviw77C-zsD3DkFQu7SXGmufdUA&w=75000&dpr=2&collections=0PS93s3CcF4&count=1
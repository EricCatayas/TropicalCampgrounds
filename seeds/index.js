const mongoose = require('mongoose');
const Campground = require('./../models/campgrounds');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

main().catch(err => console.log(err));
mongoose.set('strictQuery', false);
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp",{useNewUrlParser:true, useUnifiedTopology:true}) // Not Supported: useCreateIndex:true
    .then(()=>{
        console.log('Db Connection established');
    })
    .catch((err)=>{
        console.log(err);
    })
}

// just pass in an array -- will return a random number from array
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 15) + 10;
        const camp = new Campground({
            author: '63a91476e28d1cad1ac1f4a7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/random/300x300?camping,${i}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum cumque quis commodi, alias quaerat neque nostrum. Nostrum, fuga. Nam, mollitia?',    
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Db has been seeded successfully');
})
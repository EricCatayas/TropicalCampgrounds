if(process.env.NODE_ENV !== 'production')  // Def is 'development' mode -- in production, we don't store environment vars in files
    require('dotenv').config(); 

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/expressError');
const mongoSanitize = require('express-mongo-sanitize');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const User = require('./models/user');
const cookieeeeParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session'); 
const MongoDBStore = require('connect-mongo');     // By def, sessions are stored in memory; does not scale well or efficient
const passport = require('passport');          
const localStrategy = require('passport-local');
const helmet = require('helmet');               // GET /campgrounds .. Response? up to 15 Headers you do not want to be accessed 

app.engine('ejs', ejsMate);                    // Used for boilertemplate.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));  //Every req e.g form submit (is urlencoded)
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));      //tell express to serve our public dir because href="../../etc" is redundant
app.use(flash());        // connect.sid i.e session id, a cookie sent for verification of session

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelpCamp";   // Mongo Atlas Db is our cloud web server
const port = process.env.PORT || 80; // By default, azure listens to port 80

const store = MongoDBStore.create({          // We want our session stored in mongo, not in memory
    mongoUrl: DB_URL,
    crypto: {
        secret: 'LegitSceretive'
      },
    touchAfter: 24 * 3600,                  // Resave the session every 24hrs, not every page refresh
})
store.on("error", function(e){ console.log(e)})

const sessionOption = {
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,                                                                         //when saveUninitialized is set to false, the session will not be saved or the session cookie will not be set on the browser unless the session is modified
    cookie:{  
        expires: Date.now() + 1000 * 60 * 60 * 24, 
        // httpOnly: true, 
        secure: true,           // "This cookie should only work or be config in Https (Httpsecure); localhost is not secure" -- set true if deploying
        maxAge: 60000, 
        secure: false},           // HttpOnly: if true, the cookie cannot be accessed through client-side scripting i.e cross-site scripting
    store,
};                                                                                                                   // If secure is true, and you access your site over HTTP, the cookie will not be set.
app.use(cookieeeeParser('Heellooowww'));
app.use(mongoSanitize())                                // "Cross-site Scripting ":  malicious users could send an object containing a $ operator e.g /users/?{$gt:""}, which could change the context of a database operation.                                    
app.use(session(sessionOption));        //needed for flash -- also used for data sessions sim to cookie
app.use(passport.initialize());                              // for user login/registration -- must come after session
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));         
passport.serializeUser(User.serializeUser());                 // .How do we store user in the session?
passport.deserializeUser(User.deserializeUser());             // .How do we get the user out of the session?  e.g req.user


main().catch(err => console.log(err));

mongoose.set('strictQuery', true);
async function main() {
  await mongoose.connect(DB_URL,{useNewUrlParser:true, useUnifiedTopology:true})  //  useCreateIndex:true, Not supported XX
    .then(()=>{
        console.log('Db Connection established');
    })
    .catch((err)=>{
        console.log(err);
    })
}

// Admin: MagSci  123456
// Other: Child 123456

/* -------------- TODO      
        f. reseed your data to spread out in Philippiens -> use hoppscotch 
        g. mapbox's data expects an obj w/ a key of features, containing all the data
    TODO: images.ejs jQuery
*/  /* -------------- EJS ------------------ */ 


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dbgolykzg/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dbgolykzg/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dbgolykzg/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dbgolykzg/" ];
 
app.use(
    helmet.contentSecurityPolicy({                                // "Designating your own policy what sources, fetches are allowed (media, fonts, images)"
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbgolykzg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dbgolykzg/" ],
            childSrc   : [ "blob:" ]
        }
    })
);
const Campground = require('./models/campgrounds'); 

app.use(async (req,res,next)=>{
    res.locals.success = req.flash('success');          // <-- locals can only be ref in .ejs
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (req,res)=>{
    res.render('home');
})
app.use('/user', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

/* --------------- Cookies and Sessions ----------------  */
app.get('/getFreeCookie', (req, res)=>{
    res.cookie('name', 'Jobart');
    // const {name} = req.cookies;
    res.send('Check your browser console');
})
/* --------------- Error Handlers ----------------  */
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found', 404));
})
app.use((err,req,res,next)=>{            
    // if(err.name === 'castingError'){

    // } else if( err.name === 'ValidationError'){
    //     return new ExpressError('Check your input, then try again..', status);
    // }
    if(!err.message) err.message = 'Something went wrong';
    if(!err.status) err.status = 500;
    res.render('error', {err});
})
app.use((req,res)=>{
    res.send('Page Not Found');   // runs only when no page above exists
})
app.listen(port, ()=>{
    console.log(`I am listenin to port ${port}`);
})
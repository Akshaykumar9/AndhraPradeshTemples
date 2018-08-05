var express = require("express"),
 bodyparser= require("body-parser"),
 mongoose = require("mongoose"),
 flash=require("connect-flash"), // used to flash messages, it has inbuilt session concept from 4.x version
 Temples= require("./models/templesschema.js"),
 Comment= require("./models/commentschema.js"),
 seeds= require("./seeds.js"),
 passport= require("passport"),
 LocalStrategy=require("passport-local"),
 methodOverride= require("method-override"), //this is for PUT and DELETE method overriding 
  User= require("./models/userschema.js"),
 app = express();

var commentRoutes=require("./routes/comments"),
    templeRoutes=require("./routes/temples"),
    indexRoutes=require("./routes/index")
//seeds(); // seed the database
console.log(__dirname)
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public")); //always better to use __dirname because it ensures the current working directory
app.use(methodOverride("_method"));
app.use(flash()); //should come before passport configuration
// The below code is commented because we used thte below array as database, later this array was replaced by mangodb using mangoose
/*var temples= [
     {
         name : "Venkateswara swamy",
         image : "https://templesinindiainfo.com/wp-content/uploads/2014/09/Sri-Venkateswara-swamy-face.jpg"
     },
     {
         name : "Hanuman",
         image : "http://www.freepressjournal.in/wp-content/uploads/2018/03/lord-hanuman.jpg"
     }
     ,{
         name : "Sri Ram",
         image : "http://www.sriramwallpapers.com/img/Sri-Ram-Images.png"
     }
     ]
*/

mongoose.connect("mongodb://localhost/temple_db"); //connecting to database

//schema setup because we want to define the pattern, which needs to be added in database and to maintain consistency
// If there is a schema update then it is always better to drop the collection by using db.collections.drop(), which returns true
/*var templeschema = new mongoose.Schema({ // Currently we moved this to templeschema.js in models directory to use module.exports 
    name:String,
    image:String,
    description: String
    
})

var Temples= mongoose.model("Temple", templeschema); */// creating a model for schema so that we can interact with db

//to add new object to database we use create method.
/*Temples.create(
     {
         name : "Hanuman",
         image : "http://www.freepressjournal.in/wp-content/uploads/2018/03/lord-hanuman.jpg",
         description : "Hanuman temple in kavali is very powerful", 
     }, function(err, temple){
    if(!err){
        console.log("Create method"+temple)
    }
    else{
        console.log(err)
    }
    
})*/
//passport configuration

app.locals.moment = require('moment');
app.use(require("express-session")({
    secret:"Anandi is cool and cute",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(function(req,res,next){//middle ware which pass the currentuser details to all the pages
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");// adding message to access it in all pages
    res.locals.success=req.flash("success");// adding message to access it in all pages
    next();
})

app.use(indexRoutes);
app.use("/temples",templeRoutes);
app.use("/temples/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("Server started")
});
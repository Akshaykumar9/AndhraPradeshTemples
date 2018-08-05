var express= require("express")
var router=express.Router();

var Temples= require("../models/templesschema.js"),
    Comment= require("../models/commentschema.js"),
    passport= require("passport"),
  User= require("../models/userschema.js")

router.get("/", function(req, res){
     
     res.render("home")
     /*Temples.find({}, function(err, allTemples){
       if(err){
           console.log(err);
       } else {
          res.render("Temples/index",{temples: allTemples, page: 'temples'});
       }
    });*/
  
});
 
router.get("/temples", function(req, res){
     Temples.find({}, function(err, allTemples){
       if(err){
           console.log(err);
       } else {
          res.render("Temples/index",{temples: allTemples, page: 'temples'});
       }
    });
  
});



//Auth Routes
router.get("/temples/register", function(req, res) {
    
    
    res.render("Temples/register",{page: 'register'})
})
router.post("/register", function(req, res) {
    console.log(req.body.password);
    console.log(req.body.confirmpassword);
    console.log(req.body.password==req.body.confirmpassword);
    if(req.body.password==req.body.confirmpassword){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
          //  req.flash("error", err.message) flash is not working on custom message from data base so using the code below
         return res.render("Temples/register", {error : err.message}) 
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Andhra Pradesh Temples "+user.username); //user.username will give current username
             res.redirect("/temples")
        }) 
        
    });
    }
    else{
        req.flash("error", "password and confirmpassword should be same");
         res.redirect("/temples/register");
         
    }
})

router.get("/temples/login", function(req, res) {

    res.render("Temples/login",{page: 'login'});
    
})
router.post("/login",passport.authenticate("local" , {
    successRedirect:"/temples", 
    failureRedirect:"/temples/login",
    failureFlash: true
    
}) ,function(req, res) {
   //req.flash("error", "username or password is incorrect");
})

router.get("/logout", function(req, res) {
    req.logout();
     req.flash("success", "Logged you out");
    res.redirect("/temples");
})


module.exports= router;
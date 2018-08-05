var express= require("express")
var router=express.Router();

var Temples= require("../models/templesschema.js"),
    Comment= require("../models/commentschema.js"),
    middleware =require("../middleware") // automatically searches for index.js file
 
 
// Index Restful Route 
router.get("/", function (req, res) {
    // this will retrive the data in database which is temples_db and under collection temples
    Temples.find({}, function(err, temples){ if(!err){
        res.render("Temples/index", { temples: temples, currentUser : req.user}); //
    }
    else{
        console.log(err)
    }});
 });
 
// New Restful Route ---Directs to new form 
router.get("/new",middleware.isLoggedIn,  function (req, res) {
    // body...
    res.render("Temples/new")
});



// Create Restful Route
router.post("/",middleware.isLoggedIn,  function(req, res){
    var newTemple= {
        name : req.body.templename,
        image : req.body.templeimage,
        description : req.body.templedescription,
        author:{
            id:req.user._id,
        username:req.user.username
        }
        
    }
    // adding newTemple to temples_db
    Temples.create(newTemple, function(err, temples){ if(!err){ 
   res.redirect("/temples"); 
    }
    else{
        console.log(err)
    }});
    
});


// Show Restful Route --- this should be decalred after new route only or else it will take /temples/new  as /temples/:id
router.get("/:id", function(req, res ){
    var templeid=req.params.id;
    Temples.findById(templeid).populate("comments").exec(function(err, temple){
        if(!err){
            
            console.log("SHow page"+ temple)
        res.render("Temples/show", { temple: temple}); 
    }
    else{
        req.flash("error", "Temple details not found")
        console.log(err)
    }});
    
});

router.get("/:id/edit",middleware.checkTempleOwnership, function(req, res) {
    Temples.findById(req.params.id, function(err, foundTemple)
    {
        if(!err){
            res.render("Temples/edit", {Temples: foundTemple})         
        }
        else{
            req.flash("error", "Temple details not found")
            console.log("Error in edit page of temple"+ err)
        }
       
    }
    )
    
})

router.put("/:id",middleware.checkTempleOwnership, function(req, res) {
    
    
            Temples.findByIdAndUpdate(req.params.id, req.body.temple, function(err, updatedTemple)
    {
        if(!err){
            console.log("==================="+req.body.temple.templename+"==========================="+updatedTemple.name)
            res.redirect("/Temples/"+updatedTemple._id)
            
            
        
        }
        else{
            req.flash("error", "Temple details not found")
            console.log("Error in updating page of temple"+ err)
        }
       
    })
    
    
   

    
})


router.delete("/:id",middleware.checkTempleOwnership, function(req, res) {
    Temples.findByIdAndRemove(req.params.id, function(err, deletedTemple)
    {
        if(!err){
            
        
            res.redirect("/Temples")         
        }
        else{
            req.flash("error", "Temple details not found")
            console.log("Error in updating page of temple"+ err)
        }
       
    }
    )
    
})




module.exports= router;
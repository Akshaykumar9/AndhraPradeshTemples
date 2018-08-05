var express= require("express")
var router=express.Router({mergeParams:true});// since we declared :id in the app.js file.. to link app.js and comments.js we need to merger Parameters
var Temples= require("../models/templesschema.js"),
    Comment= require("../models/commentschema.js"),
    middleware =require("../middleware")  // automatically searches for index.js file
 

//comment routes
router.get("/new", middleware.isLoggedIn,function(req, res){
   var templeid=req.params.id;
    Temples.findById(templeid,function(err, temple){
        if(!err){
            
            console.log("Show page"+ temple)
        res.render("comments/new", { temple: temple}); 
    }
    else{
        req.flash("error", "Temple details not found")
        console.log(err)
    }});
  
    
});


router.post("/", middleware.isLoggedIn, function(req, res){ //always better to use isLoggedIn middle to post method also since it can be  called by POSTMAN etc
    var newcomments= req.body.comment;
    
    
    console.log(req.params.id)
    // adding newTemple to temples_db
    

   Temples.findById(req.params.id, function(err, temple){
        if(!err){
            
            console.log("Show page"+ temple)
        Comment.create(newcomments,function(err,comments){
            if(!err){
                console.log(req.user.username)
                comments.author.id=req.user._id;
                comments.author.username=req.user.username;
                comments.save();
                
                  temple.comments.push(comments);
             temple.save();
                req.flash("success", "Added comment successfully")
            res.redirect("/temples/"+req.params.id) 
        
        
        
            }
            else{
                req.flash("error", "Sorry, couldn't create comment")
                console.log("Something went wrong, Couldn't create comment"+err)
            }
        })
              
        }
   })     
});


//edit route on comment

router.get("/:comment_id/edit",middleware.checkCommnetOwnership, function(req,res){
  
    Comment.findById(req.params.comment_id, function(err, foundcomment) {
        if(!err){
    res.render("comments/edit", {templeid : req.params.id, comment: foundcomment})    }
    else{
        req.flash("error", "Comment details not found")
        console.log("error while finding comment "+err)
    }
    })
    
    
})

// updation of comment

router.put("/:comment_id", middleware.checkCommnetOwnership,function (req, res){
      
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundcomment) {
        
        if(!err){
          res.redirect("/temples/"+req.params.id) 
        }
    else{
        req.flash("error", "Error while updating comments")
        console.log("error while updating comment "+err)
        res.redirect("back")
    }
    })
})

//deleting a comment

router.delete("/:comment_id",middleware.checkCommnetOwnership, function (req, res){
      
      Comment.findByIdAndRemove(req.params.comment_id, function(err, foundcomment) {
            
        if(!err){
            req.flash("success", "Comment deleted")
          res.redirect("/temples/"+req.params.id) 
        }
    else{
                req.flash("error", "Error while deleting comment")
        console.log("error while deleting comment "+err)
        res.redirect("back")
    }
    })
})


module.exports= router;
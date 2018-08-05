// all middle ware code goes here

// naming index.js because we dont need to explicitly call it by it's name.. just mentioning the folder name is enoough in which index.js is contained
var Temples= require("../models/templesschema"),
    Comment= require("../models/commentschema")

var middlewareObj={}

middlewareObj.checkCommnetOwnership= function(req, res, next){
    if(req.isAuthenticated()){ //checking if user is logged in
        
    Comment.findById(req.params.comment_id, function(err, foundComment)
    {
        if(!err){
            if(foundComment.author.id.equals(req.user._id)){ //foundComment.author.id is object and req.user._id is string
            next()       
            }
            else{//if user and author are not equal
            req.flash("error", "You are not authorized to do it")
                res.redirect("back")
            }
            
        }
        else{
            req.flash("error", "Comment details not found")
            res.redirect("back") // this will take user back to the same page he/she operated on
            console.log("Error in edit page of comment authorization"+ err)
        }
       
    })
    }
    else{//check if user is not logged in
    req.flash("error", "Please Login to add new comment");
        res.redirect("back")
    }
}

middlewareObj.checkTempleOwnership= function(req, res, next){
    if(req.isAuthenticated()){ //checking if user is logged in
        
    Temples.findById(req.params.id, function(err, foundTemple)
    {
        if(!err){
            if(foundTemple.author.id.equals(req.user._id)){ //foundTemple.author.id is object and req.user._id is string
            next()       
            }
            else{//if user and author are not equal
                req.flash("error", "You are not authorized to do it")
                res.redirect("back")
            }
            
        }
        else{
            req.flash("error", "Temple details not found")
            res.redirect("back") // this will take user back to the same page he/she operated on
            console.log("Error in edit page of temple"+ err)
        }
       
    })
    }
    else{//check if user is not logged in
        req.flash("error", "Please Login to add new Temple"); 
        res.redirect("back")
    }
    
}

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    
        req.flash("error", "Please Login to Continue"); // this flash message will be executed only after page is redirected.. it will not come to effect imeediately..only after redirecting then only it works    
        res.redirect("/temples/login")
    
        
}










module.exports= middlewareObj;
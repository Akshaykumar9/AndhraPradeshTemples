var mongoose= require("mongoose");
var Temples= require("./models/templesschema")
var Comment = require("./models/commentschema")


var temples= [
     {
         name : "Venkateswara swamy",
         image : "https://templesinindiainfo.com/wp-content/uploads/2014/09/Sri-Venkateswara-swamy-face.jpg",
           description : "Hanuman temple in kavali is very powerful"
     },
     {
         name : "Hanuman",
         image : "http://www.freepressjournal.in/wp-content/uploads/2018/03/lord-hanuman.jpg",
           description : "Hanuman temple in kavali is very powerful"
     }
     ,{
         name : "Sri Ram",
         image : "http://www.sriramwallpapers.com/img/Sri-Ram-Images.png",
           description : "Hanuman temple in kavali is very powerful"
     }
     ]
     
 module.exports=   function seeds(){
 Temples.remove({}, function(err){ 
     /*if(!err){
        console.log("Removed everything from DB");
    }
    temples.forEach(function(temple){
    Temples.create(temple, function(err, temple){
        if(!err){//console.log(temple)
        
        Comment.create({
            text: "Hello this is comment section",
            author: "Anandi"
        }, function(err, comment){
             if(!err){    temple.comments.push(comment);
             temple.save();
          //   console.log(temple)
        }   
        
        })
        }
    })    
    })
    
    */
    });
    
     }
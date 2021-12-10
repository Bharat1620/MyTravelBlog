var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");


router.get("/new",middleware.isLoggedIn,function(req,res)
{
	Campground.findById(req.params.id,function(err,campground){
        console.log(req.params.id);
      if(err) console.log(err);
      else
      res.render("comments/new",{campground:campground});
	});
	
})
router.post("/",middleware.isLoggedIn,function(req,res)
{
	Campground.findById(req.params.id,function(err,campground){
      if(err) 
        {
            req.flash("error","Something went wrong");
            console.log(err);
        }
      else
      {
      Comment.create(req.body.comment,function(err,comment)
      {
      	if(err) console.log(err);
      	else
        {
            comment.author.id=req.user._id;
            comment.author.username=req.user.username;
            comment.save(function(err,comment){
      		campground.comments.push(comment._id);
      	    campground.save(function(err,campground)
      	    	{
      	    		req.flash("success","Successfully added comment");
      	    res.redirect("/campgrounds/"+campground._id);
      	    	});
            });
        }
      	    
      });
      }
	});
	
})

//comment edit and update
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res)
{
    Comment.findById(req.params.comment_id,function(err,comment){
        if(err) res.redirect("back");
        else
             res.render("comments/edit",{campground_id:req.params.id,comment:comment});  

    });

});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){

    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
        if(err) res.redirect("back");
        else
            res.redirect("/campgrounds/"+req.params.id);

    })

});

//comment delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){

    Comment.findByIdAndDelete(req.params.comment_id,function(err){
    if(err) res.redirect("back");
    else
    {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
    }
    });
})





module.exports=router;

var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id,function(err,campground){
          if(err)
          {
          	req.flash("error","Something went wrong");
           res.redirect("/campgrounds");
          }
          else
          {
          	if(campground.author.id.equals(req.user._id))
          		next();
          	else
          	{
          		req.flash("error","You don't have permission to do that");
          		res.redirect("back");
          	}
          }
		});
	}
	else
		res.redirect("back");
}

middlewareObj.checkCommentOwnership=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,function(err,comment){
          if(err)
          { 
          	req.flash("error","Something went wrong");
          	res.redirect("/campgrounds"+req.params.id);
          }
          else
          {
            if(comment.author.id.equals(req.user._id))
                next();
            else 
            {
            	req.flash("error","You don't have permission to do that");
                res.redirect("back");
            }
          }
        });
    }
    else
    {
    	req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn=function(req,res,next)
{
    if(req.isAuthenticated())
        return next();
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
}

module.exports=middlewareObj;
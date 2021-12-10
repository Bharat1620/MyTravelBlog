var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");


router.get("/",function(req,res)
{
	Campground.find({},function(err,campgrounds)
	{
		if(err)
			console.log(err);
		else 
			res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
	})
	
	
});


router.get("/new",middleware.isLoggedIn,function(req,res)
{
    
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,campground)
	{
		
      if(err) console.log(err);
      else
      	res.render("campgrounds/show",{campground:campground});
	});

});
router.post("/",middleware.isLoggedIn,function(req,res)
{
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.desc;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newcampground={name:name,image:image,description:desc,author:author,price:price};
	Campground.create(newcampground,
	function(err,campground){
		if(err) console.log(err);
		else console.log(campground);
      res.redirect("/campgrounds");
	});
	
});

//edit routes

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res)
{
	Campground.findById(req.params.id,function(err,campground)
	{
		if(err) res.redirect("/campgrounds");
		else
		 res.render("campgrounds/edit",{campground:campground});
	});
   
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res)
{

	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground)
	{
		if(err) res.redirect("/campgrounds/"+req.params.id+"/edit");
		else
		 res.redirect("/campgrounds/"+req.params.id);
	});
   
});

//delete routes
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res)
{
   Campground.findByIdAndDelete(req.params.id,function(err)
   {
      if(err) res.redirect("/campgrounds");
            else res.redirect("/campgrounds");
   });
})




module.exports=router;
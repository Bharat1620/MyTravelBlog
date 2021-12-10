var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


router.get("/",function(req,res)
{
	res.render("landing");
});



//auth routes
router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	var NewUser=new User({username:req.body.username});
	User.register(NewUser,req.body.password,function(err,user){
		if(err)
		{
			req.flash("error",err.message);
			return res.render("register");
		}
		else
		{
      
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to yelpcamp "+user.username);
				res.redirect("/campgrounds");

			});
		}
	});
});

router.get("/login",function(req,res)
{
   res.render("login");
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}),function(req,res){

});

router.get("/logout",function(req,res)
{
	req.logout();
	req.flash("error","Logged you out!");
	res.redirect("/campgrounds");
});

//middleware



module.exports=router;
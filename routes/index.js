var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/" , function(req , res){
	res.render("landing");
});


//Register Routes
router.get("/register" , function(req , res){
	res.render("register");
});

router.post("/register" , function(req , res){
	User.register({username : req.body.username} , req.body.password , function(err , user){
		if (err){
			req.flash("error" , err.message);
			res.redirect("/register");
		}else{
			passport.authenticate("local")(req , res , function(){
			req.flash("success" , "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
			});
		}
	});
});

//Login Routes
router.get("/login" , function(req , res){
	res.render("login");
});

router.post("/login" , passport.authenticate("local" ,
	{
		successRedirect : "/campgrounds",
		failureRedirect : "/login"
	}) , function(req , res){
});

//Logout Routes
router.get("/logout" , function(req , res){
	req.logout();
	req.flash("success" , "Logged you out");
	res.redirect("/campgrounds");
});

module.exports = router;
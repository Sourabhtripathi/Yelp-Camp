var  express 	= require("express"),
	 router 	= express.Router(),
	 Campground = require("../models/campground"),
	 middleware = require("../middleware");

//index route
router.get("/" , function(req , res){
	Campground.find({} , function(err , campgrounds){
		if(err){
			req.flash("error" , "Campgrounds not found");
			console.log(err);
		}else{
			res.render("campgrounds/index" , {campgrounds : campgrounds});
		}
	});
});

//new route
router.get("/new" , middleware.isLoggedIn , function(req , res){
	res.render("campgrounds/new");
});

//create route
router.post("/" , middleware.isLoggedIn , function(req , res){
	Campground.create(req.body.campground , function(err , campground){
		if (err){
			console.log(err);
		}else{
			campground.author.id = req.user._id;
			campground.author.username = req.user.username;
			campground.save();
			req.flash("success" , "Campground Successfully Created!!");
			res.redirect("/campgrounds");
		}
	});
});
//show route
router.get("/:campId" , function(req , res){
	Campground.findById(req.params.campId).populate("comments").exec(function(err , foundCampground){
		if (err){
			req.flash("error" , "Campground not found");
			console.log(err);
		}else{
			res.render("campgrounds/show" , {campground : foundCampground});
		}
	});
});
//edit route
router.get("/:campId/edit" , middleware.checkCampgroundOwnership , function(req , res){
	Campground.findById(req.params.campId , function(err , foundCampground){
		res.render("campgrounds/edit" , {campground : foundCampground});
	});
});

//update route
router.put("/:campId" , middleware.checkCampgroundOwnership , function(req , res){
	Campground.findByIdAndUpdate(req.params.campId , req.body.campground , function(err , updatedCampground){
		if (err){
			req.flash("error" , "Campground not found");
			console.log(err);
		}else{
			req.flash("success" , "Campground Successfully Updated!!");
			res.redirect("/campgrounds/" + req.params.campId);
		}
	});
});

//delete route
router.delete("/:campId/delete" , middleware.checkCampgroundOwnership , function(req , res){
	Campground.findByIdAndDelete(req.params.campId , function(err){
		if (err){
			req.flash("error" , "Campground not found");
			console.log(err);
		}else{
			req.flash("success" , "Campground Deleted!!");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
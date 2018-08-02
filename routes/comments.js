var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new route
router.get("/new" , middleware.isLoggedIn , function(req , res){
	Campground.findById(req.params.campId , function(err , foundCampground){
		if (err){
			req.flash("error" , "Campground not found");
			console.log(err);
		}else{
			res.render("comments/new" , {campground : foundCampground});
		}
	});
});

//create route
router.post("/" , middleware.isLoggedIn , function(req , res){
	Campground.findById(req.params.campId , function(err , foundCampground){
		if (err){
			req.flash("error" , "Campground not found");
			console.log(err);
		}else{
			Comment.create(req.body.comment , function(err , comment){
				if (err){
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success" , "Comment Sccessfully Created!!");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});

//edit route
router.get("/:commentId/edit" , middleware.checkCommentOwnership , function(req , res){
	Campground.findById(req.params.campId , function(err , foundCampground){
		if (err){
			req.flash("error" , "Campground not found");
			console.log(err);
		}else{
			Comment.findById(req.params.commentId , function(err , foundComment){
				res.render("comments/edit" , {comment : foundComment , campground : foundCampground});
			});
		}
	});
});

//update route
router.put("/:commentId" , middleware.checkCommentOwnership , function(req , res){
	Comment.findByIdAndUpdate(req.params.commentId , req.body.comment , function(err , updatedComment){
		if (err){
			req.flash("error" , "Comment not found");
			console.log(err);
		}else{
			req.flash("success" , "Comment Sccessfully Updated!!");
			res.redirect("/campgrounds/" + req.params.campId);
		}
	});
});

//delete route
router.delete("/:commentId/delete" , middleware.checkCommentOwnership , function(req , res){
	Comment.findByIdAndDelete(req.params.commentId , function(err){
		if (err){
			req.flash("error" , "Comment not found");
			console.log(err);
		}else{
			req.flash("success" , "Comment Sccessfully Deleted!!");
			res.redirect("/campgrounds/" + req.params.campId);
		}
	});
});

module.exports = router;
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW COMMENT - SHOW ADD COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
			console.log(err);
			req.flash("error", "Unable to retrieve campground.");
			res.redirect("/camgrounds");
		} else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
			console.log(err);
			req.flash("error", "Unable to retrieve campground.");
			res.redirect("/camgrounds");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					req.flash("error", "Something went wrong. " + err.message);
					res.redirect("/campgrounds/" + req.params.id);
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added your comment.");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

// EDIT - SHOW FORM TO EDIT A COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
	res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});
});

// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
		if(err || !comment){
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/campgrounds/" + req.params.id);
		} else{
			req.flash("success", "Successfully updated your comment.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY COMMENT
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/campgrounds/" + req.params.id);
		} else{
			req.flash("success", "Successfully deleted your comment.");			
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;
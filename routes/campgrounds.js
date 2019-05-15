var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX - LIST ALL CAMGROUNDS
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/");
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});
});

// CREATE CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {id: req.user._id, username: req.user.username};
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, campground){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/camgrounds");
		} else{
			req.flash("success", "Successfully added a campground.");
			res.redirect("/campgrounds");
		}
	});
});

// NEW - SHOW FORM TO MAKE A CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW - SHOW INFO OF A CAMPGROUND
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
		if(err || !campground){
			console.log(err);
			req.flash("error", "Unable to retrieve campground.");
			res.redirect("/camgrounds");
		} else{
			res.render("campgrounds/show", {campground: campground});
		}
	});
});

// EDIT - SHOW FORM TO EDIT A CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
	res.render("campgrounds/edit", {campground: req.campground});
});

// UPDATE A CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		if(err || !campground){
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/campgrounds/" + req.params.id);
		} else{
			req.flash("success", "Successfully updated campground.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY A CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
		if(err || !deletedCampground){
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({_id: {$in: deletedCampground.comments}}, function(err){
				if(err){
					console.log(err);
				}
			});
			req.flash("success", "Successfully deleted campground.");
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;
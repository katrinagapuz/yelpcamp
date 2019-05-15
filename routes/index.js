var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// SHOW LANDING PAGE
router.get("/", function(req, res){
	res.render("landing");
});

// NEW USER - SHOW SIGN UP FORM
router.get("/register", function(req, res){
	res.render("register");
});

// CREATE USER
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err || !user){
			console.log(err);
			req.flash("error", "Something went wrong. " + err.message);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username + "!");
				res.redirect("/");
			});
		}
	});
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
	res.render("login");
});

// HANDLE LOGIN
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

// HANDLE LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have successfully logged out.");
	res.redirect("/campgrounds");
});


module.exports = router;
var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	methodOverride 	= require("method-override"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	passportLocal	= require("passport-local"),
	User 			= require("./models/user")
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	seedDB			= require("./seed");

var	campgroundRoutes = require("./routes/campgrounds"),
	commentsRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");


// INITIALIZE DEPENDENCIES
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true ,useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "YelpCamp secret key string",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARES
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.errorMsg = req.flash("error");
	res.locals.successMsg = req.flash("success");
	next();
});

// INITIALIZE ROUTES
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(indexRoutes);

// SEED THE DATABASE
//seedDB();

// START SERVER
app.listen("8080", function(){
	console.log("YelpCamp server started.");
});

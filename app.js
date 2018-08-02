var express 			  = require("express"),
	mongoose 			  = require("mongoose"),
	bodyParser 			  = require("body-parser"),
	methodOverride 		  = require("method-override"),
	app 				  = express(),
	Campground 			  = require("./models/campground"),
	Comment 			  = require("./models/comment"),
	User 				  = require("./models/user"),
	passport 			  = require("passport"),
	LocalStrategy 		  = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
	flash				  = require("connect-flash");


var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp");

// App Config
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret : "F.R.I.E.N.D.S is the best",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req , res , next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:campId/comments" , commentRoutes);
app.use("/" , indexRoutes);

//Passport Config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());	

app.listen(3000 , function(){
	console.log("Server Started");
});
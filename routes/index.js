var express 	= require("express");
var router		= express.Router();
var passport 	= require("passport");

var Location		= require("../models/location"),
	User 			= require("../models/user"),
	middleware		= require("../middleware/index.js");

//Index Route
router.get("/", middleware.isLoggedIn,  function(req, res){
		Location.find({"author.id": req.user._id}, function(err, allLocations){
		if(err){
			console.log(err);
		} else {
			//render
			res.render("index", {locations: allLocations});
		}
	});
});

router.get("/map", function(req, res){
	res.redirect("/")
});


//New Route
router.get("/map/new", middleware.isLoggedIn, function(req, res){
	res.render("new")
});

//Create Route
router.post("/map", middleware.isLoggedIn, function(req, res){
	//get data and add to the array
	var city = req.body.city;
	var country = req.body.country;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newLocation = {city: city, country: country, author: author}

	//Create a new Location and save
	Location.create(newLocation, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to the page
			res.redirect("/map");
		}
	});
});

//Destroy Route
router.delete("/map/:id", middleware.checkLocationOwnership, function(req, res){
	Location.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/");
		}
	})
});

module.exports = router;
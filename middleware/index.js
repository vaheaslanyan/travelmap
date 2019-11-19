var Location = require("../models/location");

var middlewareObj = {};

//check post ownership
middlewareObj.checkLocationOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Location.findById(req.params.id, function(err, foundLocation){
			if(err){
				req.flash("error", "Location not found");
				res.redirect("back");
			} else {
				if (!foundLocation) { // this handles the error if location is not found and returns null meaning that the format of the id is correct but there is no data under that id in mongoDB
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				//does the user own the post
				if(foundLocation.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "Only the user who created the post can modify it");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in");
		res.redirect("back");
	}
}

//checking if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/welcome")
}

module.exports = middlewareObj;
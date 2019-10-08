var mongoose = require("mongoose");

var locationSchema = new mongoose.Schema({
	city: String,
	country: String
	
})

module.exports = mongoose.model("Location", locationSchema);
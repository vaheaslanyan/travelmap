var mongoose = require("mongoose");

var locationSchema = new mongoose.Schema({
	city: String,
	country: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
})

module.exports = mongoose.model("Location", locationSchema);
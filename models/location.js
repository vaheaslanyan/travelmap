var mongoose = require("mongoose");

var locationSchema = new mongoose.Schema({
	country: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
})

//Avoiding duplicate countries by the same user
locationSchema.index({ country: 1, author: 1 }, { unique: true });

module.exports = mongoose.model("Location", locationSchema);
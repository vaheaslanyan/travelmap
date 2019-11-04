var mongoose 			  = require("mongoose"),
	passportLocalMongoose = require ("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	name: String,
	password: String,
	email: {type: String, unique: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
var express 	= require("express");
var router		= express.Router();
var passport 	= require("passport");

var Location		= require("../models/location"),
	User 			= require("../models/user"),
	middleware		= require("../middleware/index.js");

//password reset packages
var async			= require("async"),
	nodemailer		= require("nodemailer"),
	crypto			= require("crypto");//we don't have to install this one just require 

//=======AUTH ROUTES========

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handling register logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username, name: req.body.name, email: req.body.email});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);// flash message that shows the user the error
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + user.username);// flash message when successfully signed up
			res.redirect("/map");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handling login logic (app.post("login", middleware, callback))
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/map",
		failureRedirect: "/login",
		failureFlash: 'Invalid username or password.' 
	}), function(req, res){
		
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("error", "Logged Out"); // flash messages are added right before redirecting
	res.redirect("/map");
});

//password reset
router.get("/forgot", function(req, res){
	res.render("forgot");
});

router.post("/forgot", function(req, res, next){
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({email: req.body.email}, function(err, user){
				if(!user) {
					req.flash('error', 'No account with that email address exists. Please check the spelling and try again.');
					return res.redirect("/forgot");
				}
				
				user.resetPasswordToken = token;
				user.resetPasswordExpress = Date.now() + 3600000 // 1 hour
				
				user.save(function(err) {
					done(err, token, user);	
				});
			});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({ //setting up Gmail SMTP
				service: 'SendPulse',
				auth: {
					user: 'vahe.help@gmail.com',
					pass: "'" + process.env.GMAILPW + "'"
				}
		});
		var mailOptions = {
			to: user.email,
			from: 'vahe.help@gmail.com',
			subject: "Traveler's Map Password Reset",
			text: 	"You have requested a password reset.\n\n" + 
					"If you forgot your password, don't worry just follow the link, or paste it in your browser to complete the process:\n\n" + 
					"http://" + req.headers.host + "/reset/" + token + '\n\n' +
					"If you did not request this, please reply to this email.\n\n"
		};
		smtpTransport.sendMail(mailOptions, function(err){
			console.log("mail sent");
			req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
			done(err, 'done');
		});
		}
	], function(err){
		res.redirect("/forgot");
	});
});

router.get("/reset/:token", function(req, res){
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
		if (!user) {
			req.flash("error", "Password reset token is invalid or has expired. Please request a new reset link.");
			return res.redirect("/forgot");
		}
		res.render("reset", {token: req.params.token});
	});
});

router.post("/reset/:token", function(req, res){
	async.waterfall([
		function(done){
			User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
				if(!user){
					req.flash("error", "Password reset token is invalid or has expired. Please request a new reset link.");
					return res.redirect("back");
				}
				//suppose to have confirm password logic here but it is in script.js instead. Check to see which one is better
				user.setPassword(req.body.password, function(err) {
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save(function(err){
						req.logIn(user, function(err) {
							done(err, user);
						});
					});
				})
				
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: "vahe.help@gmail.com",
					pass: process.env.GMAILPW
				}
			});
			var mailOptions = {
				to: user.email,
				from: "vahe.help@gmail.com",
				subject: "Your Traveler's Map password has been changed",
				text: "Hi " + user.name +
					"This is a confirmation that the password for your account " + user.email + " has been successfully changed."
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash("success", "Done! Your password has been changed.");
				done(err);
			});
		}
	], function(err) {
		res.redirect("/campgrounds");
	});
});

module.exports = router;
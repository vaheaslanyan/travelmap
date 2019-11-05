var express 		= require("express"),
	app				= express();

var mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	flash 			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride	= require("method-override");

//password reset packages
var async			= require("async"),
	nodemailer		= require("nodemailer"),
	crypto			= require("crypto");//we don't have to install this one just require 

var Location		= require("./models/location"),
	User 			= require("./models/user"),
	middleware		= require("./middleware/index.js");

//variables for app.listen
const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";

//an enviromental url for the db and backup for our mongodb url in case the enviromental variable breaks for some reason
const url = process.env.DATABASEURL || "mongodb://localhost/travelmap";

//requiring routes
var indexRoutes 		= require("./routes/index"),
	userRoutes			= require("./routes/user");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//mongoose setup	
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR: ", err.message);
})

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: process.env.PSECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing the currentUser info, and flash messages to every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//using routes
app.use(indexRoutes);
app.use(userRoutes);

app.listen(port, function(){
    console.log("Server has started .... at port "+ port+" ip: "+ip);
});
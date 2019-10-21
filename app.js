var express 		= require("express"),
	app				= express();

var mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	flash 			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local")

var Location		= require("./models/location"),
	User 			= require("./models/user"),
	middleware		= require("./middleware/index.js");

//an enviromental url for the db and backup for our mongodb url in case the enviromental variable breaks for some reason
var url = process.env.DATABASEURL || "mongodb://localhost/travelmap";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
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
	secret: "I never wear v-neck cuz I'm all about my crew, reppin westside yeah that W",
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


app.get("/", middleware.isLoggedIn,  function(req, res){
		Location.find({"author.id": req.user._id}, function(err, allLocations){
		if(err){
			console.log(err);
		} else {
			//render
			res.render("index", {locations: allLocations});
		}
	});
});

app.get("/map", function(req, res){
	res.redirect("/")
});

//New Route
app.get("/map/new", middleware.isLoggedIn, function(req, res){
	res.render("new")
});

//Create Route
app.post("/map", middleware.isLoggedIn, function(req, res){
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

//=======AUTH ROUTES========

//show register form
app.get("/register", function(req, res){
	res.render("register");
});

//handling register logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
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
app.get("/login", function(req, res){
	res.render("login");
});

//handling login logic (app.post("login", middleware, callback))
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/map",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout route
app.get("/logout", function(req, res){
	req.logout();
	req.flash("error", "Logged Out"); // flash messages are added right before redirecting
	res.redirect("/map");
});


app.listen(3000, function(){
	console.log("Server listening on port 3000")
});
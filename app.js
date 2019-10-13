var express 	= require("express"),
	app			= express();

var mongoose 	= require("mongoose"),
	bodyParser	= require("body-parser"),
	flash 		= require("connect-flash");

var Location	= require("./models/location"),
	User 		= require("./models/user");

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


app.get("/", function(req, res){
		Location.find({}, function(err, allLocations){
		if(err){
			console.log(err);
		} else {
			//render
			res.render("index", {locs: allLocations});
		}
	});
});

app.get("/map", function(req, res){
	res.redirect("/")
});

//New Route
app.get("/map/new", function(req, res){
	res.render("new")
});

//Create Route
app.post("/map", function(req, res){
	//get data and add to the array
	var city = req.body.city;
	var country = req.body.country;
	var newLocation = {city: city, country: country}
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


app.listen(3000, function(){
	console.log("Server listening on port 3000")
});
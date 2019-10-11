var express 	= require("express"),
	app			= express();

var mongoose 	= require("mongoose");
var bodyParser	= require("body-parser");

var Location	= require("./models/location");

//an enviromental url for the db and backup for our mongodb url in case the enviromental variable breaks for some reason
var url = process.env.DATABASEURL || "mongodb://localhost/travelmap";

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

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


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
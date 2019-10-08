var express 	= require("express"),
	app			= express();

var mongoose 	= require("mongoose");

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
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res){
	res.render("index")
});

app.get("/map", function(req, res){
	res.redirect("/")
})

//new route
app.get("/map/new", function(req, res){
	res.render("new")
});

app.listen(3000, function(){
	console.log("Server listening on port 3000")
})
let express = require("express");
var config = require("config");//dùng để config với apache
var bodyParser = require("body-parser");//Dùng để parse từ file json trả về
var session = require("express-session");
var app = express();
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//express session
app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
//set ejs
app.set("views",__dirname + "/apps/views");
app.set("view engine","ejs");
//Static folder
app.use("/static",express.static(__dirname +"/public"));

var controllers = require(__dirname + "/apps/controllers");
app.use(controllers);

var host = config.get("sever.host");
var port = config.get("sever.port");
app.listen(port,host,function(){
    console.log("Sever is running on port:",port);
})
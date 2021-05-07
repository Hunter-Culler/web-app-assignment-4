/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 3

	March 31st, 2021

	Status = Functional
*/

const express = require("express"),
app = express(),
layouts = require("express-ejs-layouts"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
expressSession = require("express-session"),
cookieParser = require("cookie-parser"),
connectFlash = require("connect-flash"),
passport = require("passport"),
usersController = require("./controllers/usersController"),
homeController = require("./controllers/homeController"),
errorController = require("./controllers/errorController"),
User = require("./models/user");


mongoose.Promise = global.Promise;

mongoose.connect(
	process.env.MONGODB_URI ||
	"mongodb://localhost:27017/social_media_website",
	{ useNewUrlParser: true, useFindAndModify: false }
  );


mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 8080);

app.set(
	"view engine",
	 "ejs"
	 );
app.use(layouts);
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
	methodOverride("_method", {
	  methods: ["POST", "GET"]
	})
  );

app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(connectFlash());

app.get("/", usersController.getLogInPage);

app.use(express.static("public"));





app.get("/home", homeController.showHome);
app.get("/signup", usersController.getSignUpPage);
app.get("/users", usersController.getAllUsers);
app.post("/sign_in", usersController.signIn);
app.post("/signUp", usersController.signUp);

//app.use(errorController.pageNotFoundError);
//app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port: ${app.get("port")}`)
});
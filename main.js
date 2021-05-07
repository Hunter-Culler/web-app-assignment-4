/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 3

	March 31st, 2021

	Status = Functional
*/

const express = require("express"), app = express(),
usersController = require("./controllers/usersController"),
homeController = require("./controllers/homeController"),
errorController = require("./controllers/errorController"),
layouts = require("express-ejs-layouts"),
mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(
	process.env.MONGODB_URI ||
	"mongodb://localhost:27017/social_media_website",
	{ useNewUrlParser: true, useFindAndModify: false }
  );

app.set("port", process.env.PORT || 8080);

app.set("view engine", "ejs");
app.use(layouts);

app.get("/", usersController.getLogInPage);

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

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
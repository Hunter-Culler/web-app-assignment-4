/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 3

	May 12th, 2021

	Status = Functional
*/

const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  morgan = require("morgan"),
  bcrypt = require("bcrypt"),
  expressValidator = require("express-validator"),
  passport = require("passport"),
  usersController = require("./controllers/usersController"),
  homeController = require("./controllers/homeController"),
  postsController = require("./controllers/postsController"),
  errorController = require("./controllers/errorController"),
  User = require("./models/user"),
  Post = require("./models/post");


mongoose.Promise = global.Promise;

mongoose.connect(
	"mongodb://localhost:27017/social_media_website",
	{ useNewUrlParser: true, useFindAndModify: false }
)
.then(() => {
  console.log('database connected')
})
.catch((err) => console.log(err.message));

mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set(
	"view engine",
	 "ejs"
	 );
app.set("token", process.env.TOKEN || "SoCiALT0k3n");

router.use(morgan("combined"));

router.use(layouts);
router.use(
    express.urlencoded({
        extended: false
    })
);

router.use(
	methodOverride("_method", {
	  methods: ["POST", "GET"]
	})
  );

router.use(express.json());
router.use(cookieParser("secret_passcode"));
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(connectFlash());
router.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

router.use(express.static("public"));
//!!FIXME!! exoressValidator isnt a function error
//router.use(expressValidator());

router.get("/", homeController.showSignIn);
router.get("/signup", homeController.showSignUp);
router.post("/signup", usersController.create, usersController.redirectView);

router.get("/login", homeController.showSignIn);
//router.post("/login", usersController.authenticate, usersController.redirectView);
router.post("/users/login", usersController.authenticate, usersController.redirectView);

//router.use(usersController.verifyJWT);

router.get("/logout", usersController.logout, usersController.redirectView);

router.get("/home/:id", usersController.showHome, usersController.showViewHome);

router.get("/users/:id/page", usersController.showUserPage, usersController.showViewUserPage);

router.get("/users/:id/posts", usersController.showPosts, usersController.showViewPosts);

router.get("/posts", postsController.index, postsController.indexView);
router.get("/posts/new", postsController.new);
router.post("/posts/:id/create",  postsController.create);
router.get("/posts/:id", postsController.show, postsController.showView);
router.delete("/posts/:id/delete", postsController.delete, postsController.redirectView);

router.get("/users/:id/edit", usersController.edit, usersController.showEdit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);

//router.use(errorController.pageNotFoundError());
//router.use(errorController.internalServerError());

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port: ${app.get("port")}`)
});
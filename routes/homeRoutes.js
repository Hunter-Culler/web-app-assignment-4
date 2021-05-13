const router = require("express").Router(),
passport = require("passport"),
usersController = require("../controllers/usersController"),
homeController = require("../controllers/homeController");

//signup routes
router.get("/", homeController.showSignIn);
router.get("/signup", homeController.showSignUp);
router.post("/signup", usersController.validate, usersController.create, usersController.redirectView);

//signin routes
router.get("/users/login", homeController.showSignIn);
router.post("/users/login", passport.authenticate('local' , {failureRedirect:'/', failureFlash: true, successFlash: "Logged in!"}),
function(req, res) {
   res.redirect(`/home/${req.user._id}`);
});

module.exports = router;
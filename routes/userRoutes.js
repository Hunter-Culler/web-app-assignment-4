const router = require("express").Router(),
passport = require("passport"),
usersController = require("../controllers/usersController");

//logout
router.get("/logout", usersController.logout, usersController.redirectView);

router.post("/users/login", passport.authenticate('local' , {failureRedirect:'/', failureFlash: true, successFlash: "Logged in!"}),
function(req, res) {
   res.redirect(`/home/${req.user._id}`);
});

//homepage
router.get("/home/:id", usersController.showHome, usersController.showViewHome);

//user page
router.get("/users/:id/page", usersController.showUserPage, usersController.showViewUserPage);

//posts page
router.get("/users/:id/posts", usersController.showPosts, usersController.showViewPosts);

//edit
//router.get("/users/:id/edit", usersController.edit, usersController.showEdit);

//update
//router.put("/users/:id/update", usersController.update, usersController.redirectView);

//add friend
router.get("/users/:id/addFriend", usersController.addFriend, usersController.showViewUserPage);

module.exports = router;
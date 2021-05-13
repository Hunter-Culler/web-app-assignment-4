const router = require("express").Router(),
usersController = require("../controllers/usersController");

router.get("/logout", usersController.logout, usersController.redirectView);

router.get("/home/:id", usersController.showHome, usersController.showViewHome);

router.get("/users/:id/page", usersController.showUserPage, usersController.showViewUserPage);

router.get("/users/:id/posts", usersController.showPosts, usersController.showViewPosts);

router.get("/users/:id/edit", usersController.edit, usersController.showEdit);

router.put("/users/:id/update", usersController.update, usersController.redirectView);

router.get("/users/:id/addFriend", usersController.addFriend, usersController.showViewUserPage);

const router = require("express").Router(),
homeRoutes = require("./homeRoutes"),
postRoutes = require("./postRoutes"),
userRoutes = require("./userRoutes");


//define name spaces
router.use("/posts", postRoutes);
router.use("/users", userRoutes);
router.use("/home", userRoutes);
router.use("/", homeRoutes);
module.exports = router;
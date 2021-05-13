const router = require("express").Router(),
postsController = require("../controllers/postsController");

router.get("/posts", postsController.index, postsController.indexView);
router.get("/posts/new", postsController.new);
router.post("/posts/:id/create",  postsController.create);
router.get("/posts/:id", postsController.show, postsController.showView);
router.delete("/posts/:id/delete", postsController.delete, postsController.redirectView);

module.exports = router;
const express = require("express")
const router = express.Router()

const posts = require("../../controller/posts.controller");

router.post("/", posts.create);

router.post("/:_id", posts.updatePost);

router.get("/", posts.findAllPost);

router.get("/:authorId/posts", posts.getAuthorPosts);

router.get("/:_id", posts.findPostById);

router.delete("/:_id", posts.deletePost);


module.exports = router
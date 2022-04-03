const db = require("../models");
const Posts = db.posts
const { ObjectId } = require('bson');

const response = {
    status: 200,
    result: null,
    message: null,
    error: null,
    length: 0
}

exports.create = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "Title is required"
            }
        });
    }
    if (!req.body.author) {
        return res.status(400).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "Author is required"
            }
        });
    }
    if (!req.body.text) {
        return res.status(400).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "Text is required"
            }
        });
    }

    const posts = new Posts({
        title: req.body.title,
        author: req.body.author,
        text: req.body.text,
        img: req.body.img
    });

    posts
        .save(posts)
        .then(data => {
            response.length = 1;
            response.result = data;
            response.message = "Success create posts"
            res.send(response);
        })
        .catch(err => {
            response.status = 500;
            response.message = "Some error occurred while creating the posts.";
            response.error.message = err.message || "Some error occurred while creating the posts.";
            res.status(response.status).send(response);
        });

};

exports.findAllPost = (req, res) => {
    Posts.find()
        .then(data => {
            response.length = data.length;
            response.result = data;
            response.message = "Success get all posts"
            res.send(response);
        })
        .catch(err => {
            response.status = 500;
            response.message = "Some error occurred while retrieving posts.";
            response.error.type = "";
            response.error.message = err.message || "Some error occurred while retrieving [posts.";
            res.status(response.status).send(response);
        });
};

exports.updatePost = (req, res) => {
    if (!req.body) {
        response.status = 500;
        response.message = "Invalid data";
        response.error.type = "invalid data";
        response.error.message = "Data to update can not be empty!";
        res.status(response.status).send(response);
    }
    if (!req.params._id) {
        response.status = 500;
        response.message = "Invalid data";
        response.error.type = "invalid data";
        response.error.message = "_id is required!";
        res.status(response.status).send(response);
    }

    if (!req.body.title) {
        return res.status(400).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "Title is required"
            }
        });
    }
    if (!req.body.author) {
        return res.status(400).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "Author is required"
            }
        });
    }
    if (!req.body.text) {
        return res.status(400).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "Text is required"
            }
        });
    }

    Posts.findByIdAndUpdate(
        req.params._id,
        {
            title: req.body.title,
            author: new ObjectId(req.body.author),
            text: req.body.text,
            img: req.body.img
        })
        .then(data => {
            if (!data) {
                response.status = 404;
                response.message = "Invalid id";
                response.error.type = "invalid id";
                response.error.message = `Cannot update post with id=${id}.`;
                res.status(response.status).send(response);
            } else {
                response.message = 'Post was updated successfully.';
                response.result = data;
                response.length = 1;
                res.send(response)
            }
        })
        .catch(err => {
            response.status = 500;
            response.message = "Invalid id";
            response.error.type = "invalid id";
            response.error.message = `Error updating Post with id=${id}.`;
            res.status(response.status).send(response);
        });
}

exports.findPostById = (req, res) => {
    Posts.find({
        _id: req.params._id,

    })
        .then(data => {
            response.length = 1;
            response.result = data[0];
            response.message = "Success find post by id"
            res.send(response);
        })
        .catch(err => {
            response.status = 500;
            response.message = "Some error occurred while retrieving get post.";
            response.error.type = "Invalid id";
            response.error.message = "Some error occurred while retrieving get post.";
            res.status(response.status).send(response);
            res.status(500).send({
                message: 'Failed to get post for selected id.',
            });
        });
};

exports.deletePost = async (req, res) => {
    console.log(req.params._id);
    const id = req.params._id;

    Posts.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                response.status = 404;
                response.message = "Invalid id";
                response.error.type = "invalid id";
                response.error.message = `Cannot delete post with id=${id}.`;
                res.status(response.status).send(response);
            } else {
                response.message = 'Post was deleted successfully!';
                response.length = 1;
                response.result = null;
                res.send(response);
            }
        })
        .catch(err => {
            response.status = 500;
            response.message = "Invalid id";
            response.error.type = "invalid id";
            response.error.message = `Could not delete post with id=${id}.`;
            res.status(response.status).send(response);
        });

};

exports.getAuthorPosts = async (req, res) => {
    Posts.find({
        author: req.params.authorId,
    })
        .then(data => {
            response.length = data.length;
            response.result = data;
            response.message = "Success find posts by author"
            res.send(response);
        })
        .catch(err => {
            console.log(err);
            response.status = 500;
            response.message = "Invalid author id.";
            response.error.type = "Invalid author id";
            response.error.message = "Failed to get posts by selected author id.";
            res.status(response.status).send(response);
        });
};
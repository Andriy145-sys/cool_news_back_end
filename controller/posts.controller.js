const db = require("../models");
const Posts = db.posts
const { ObjectId } = require('bson');

const response = {
    status: 200,
    result: null,
    message: null,
    error: {},
    length: 0
}

exports.create = async (req, res) => {
    if (!req.body.title) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `title is required`;
        return res.status(200).send(response);
    }
    if (!req.body.author_id) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `author_id is required`;
        return res.status(200).send(response);
    }

    if (!req.body.author_username) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `author_username is required`;
        return res.status(200).send(response);
    }

    if (!req.body.text) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `text is required`;
        return res.status(200).send(response);
    }

    const posts = new Posts({
        title: req.body.title,
        author_id: req.body.author_id,
        author_username: req.body.author_username,
        text: req.body.text,
        img: req.body.img
    });

    posts
        .save(posts)
        .then(data => {
            response.length = 1;
            response.status = 200;
            response.result = null;
            response.message = "Success create posts"
            res.send(response);
        })
        .catch(err => {
            response.status = 500;
            response.message = "Some error occurred while creating the posts.";
            response.error.message = err.message || "Some error occurred while creating the posts.";
            res.status(200).send(response);
        });

};

exports.findAllPost = async (req, res) => {
    let skip = 0
    let limit = 10
    let countPosts = 0
    Posts.count((err, count) => {
        console.log(count)
         countPosts = count;
    })
    if (req.params.page) {
        skip = limit * (req.params.page - 1)
    }
    Posts.find().limit(limit).skip(skip)
        .sort({
            date_of_create: 'desc'
        })
        .then(data => {
            response.status = 200;
            response.length = data.length;
            response.result = data;
            response.total_items = countPosts;
            response.message = "Success get all posts"
            res.send(response);
        })
        .catch(err => {
            response.status = 500;
            response.message = "Some error occurred while retrieving posts.";
            response.error.type = "";
            response.error.message = err.message || "Some error occurred while retrieving [posts.";
            res.status(200).send(response);
        });
};

exports.updatePost = (req, res) => {
    if (!req.body) {
        response.status = 500;
        response.message = "Invalid data";
        response.error.type = "invalid data";
        response.error.message = "Data to update can not be empty!";
        res.status(200).send(response);
    }
    if (!req.params._id) {
        response.status = 500;
        response.message = "Invalid data";
        response.error.type = "invalid data";
        response.error.message = "_id is required!";
        res.status(200).send(response);
    }

    if (!req.body.title) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `title is required`;
        return res.status(200).send(response);
    }
    if (!req.body.author_id) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `author_id is required`;
        return res.status(200).send(response);
    }

    if (!req.body.author_username) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `author_username is required`;
        return res.status(200).send(response);
    }

    if (!req.body.text) {
        response.status = 400;
        response.message = "Validation error";
        response.error.type = "Validation error";
        response.error.message = `text is required`;
        return res.status(200).send(response);
    }

    Posts.findByIdAndUpdate(
        req.params._id,
        {
            title: req.body.title,
            author_id: new ObjectId(req.body.author_id),
            author_username: req.body.author_username,
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
                response.status = 200;
                response.error = {};
                response.message = 'Post was updated successfully.';
                response.result = null;
                response.length = 0;
                res.send(response)
            }
        })
        .catch(err => {
            response.status = 500;
            response.message = "Invalid id";
            response.error.type = "invalid id";
            response.error.message = `Error updating Post with id=${id}.`;
            res.status(200).send(response);
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
            res.status(200).send(response)
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
            res.status(200).send(response);
        });

};

exports.getAuthorPosts = async (req, res) => {
    let skip = 0
    let limit = 10

    if (req.params.page) {
        skip = limit * (req.params.page - 1)
    }
    Posts.find({
        author_id: req.params.authorId,
    })
        .limit(limit).skip(skip)
        .sort({
            date_of_create: 'desc'
        })
        .then(data => {
            response.length = data.length;
            response.result = data;
            response.message = "Success find posts by author"
            response.total_items = data.length;
            res.send(response);
        })
        .catch(err => {
            console.log(err);
            response.status = 500;
            response.message = "Invalid author id.";
            response.error.type = "Invalid author id";
            response.error.message = "Failed to get posts by selected author id.";
            res.status(200).send(response);
        });
};
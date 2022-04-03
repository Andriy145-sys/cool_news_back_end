const db = require('../models');
const User = db.user;
const crypto = require('crypto');

let response = {
    status: 200,
    result: null,
    message: null,
    error: {},
    length: 0
}

// Create a new User
exports.create = async (req, res) => {

    let isValidUsername = await this.checkUsername(req.body.username);

    if (!isValidUsername) {
        response.status = 401;
        response.error.type = "Unique username",
        response.error.message = "The username field must contain a unique value"
        response.message = "Validation error"
        return res.status(200).send(response);
    }

    let isValidEmail = await this.checkEmail(req.body.email);

    if (!isValidEmail) {
        response.status = 401;
        response.error.type = "Unique email",
        response.error.message = "The email field must contain a unique value"
        response.message = "Validation error"
        return res.status(200).send(response);
    }

    if (!req.body.username) {
        return res.status(200).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "username is required"
            }
        });
    }

    if (!req.body.email) {
        return res.status(200).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "email is required"
            }
        });
    }

    if (!req.body.password) {
        return res.status(200).send({
            status: 400,
            error: {
                type: "Validation error",
                message: "password is required"
            }
        });
    }

    //hashing pass
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`);

    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        hash: hash,
        salt: salt,
    });

    user
        .save(user)
        .then(data => {
            response.length = 1;
            response.result = data;
            response.message = "Success create user"
            res.send(response);
        })
        .catch(err => {
            response.status = 500;
            response.message = "Some error occurred while creating the user.";
            response.error.type = "";
            response.error.message = err.message || "Some error occurred while creating the user.";
            res.status(200).send(response);
        });
};


// login user
exports.login = (req, res) => {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (user === null) {
            response.status = 400;
            response.message = "Invalid email";
            response.error.type = "invalid email";
            response.error.message = `User not found`;
            return res.status(200).send(response);
        } else {
            var hash = crypto
                .pbkdf2Sync(req.body.password, user.salt, 1000, 64, `sha512`)
                .toString(`hex`);
            if (user.hash == hash) {
                response.message = "Login is success";
                response.result = {_id : user._id};
                user.save();
                return res.status(200).send(response);
            } else {
                response.status = 400;
                response.message = "Invalid password";
                response.error.type = "invalid password";
                response.error.message = `Inccorect password`;
                return res.status(400).send(response);
            }
        }
    });
};

exports.checkEmail = async (email) => {

    let result = [];
    await User.find({
        email: email,
    })
        .then(data => {
            result = data;
        })

    if (result.length !== 0) {
        return false
    } else {
        return true
    }
}

exports.checkUsername = async (username) => {

    let result = [];
    await User.find({
        username: username,
    })
        .then(data => {
            result = data;
        })

    if (result.length !== 0) {
        return false
    } else {
        return true
    }
}
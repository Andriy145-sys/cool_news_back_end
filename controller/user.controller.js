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

exports.changePassword = async (req, res) => {
	id = req.params._id;
	User.findOne({ _id: id }, function (err, user) {
		if (user === null) {
			response.status = 400;
			response.message = "Invalid id";
			response.error.type = "invalid id";
			response.error.message = `Користувача не знайдено.`;
			return res.status(200).send(response);
		} else {
			var oldHash = crypto
				.pbkdf2Sync(req.body.current_password, user.salt, 1000, 64, `sha512`)
				.toString(`hex`);
			if (user.hash == oldHash) {
				let salt = crypto.randomBytes(16).toString('hex');
				let hash = crypto
					.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`)
					.toString(`hex`);
				User.findByIdAndUpdate(
					id,
					{ hash: hash, salt: salt },
					{ useFindAndModify: false }
				)
					.then(data => {
						if (!data) {
							response.status = 404;
							response.message = "Not found";
							response.error.type = "Not found";
							response.error.message = `Cannot update user with id=${id}.`;
							res.status(200).send(response);
						} else {
							response.status = 200
							response.error = {}
							response.message = 'User was updated successfully.';
							response.length = 1;
							res.send(response)
						}
					})
					.catch(err => {
						response.status = 500;
						response.message = "Invalid id";
						response.error.type = "invalid id";
						response.error.message = `Error updating user with id=${id}.`;
						res.status(200).send(response);
					});
			} else {
				response.status = 400;
				response.message = "Invalid password";
				response.error.type = "invalid password";
				response.error.message = `Old password inccorect`;
				return res.status(200).send(response);
			}
		}
	});
}

exports.updateUserData = (req, res) => {
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

	if (!req.body.username) {
		return res.status(400).send({
			status: 400,
			error: {
				type: "Validation error",
				message: "username is required"
			}
		});
	}
	if (!req.body.email) {
		return res.status(400).send({
			status: 400,
			error: {
				type: "Validation error",
				message: "email is required"
			}
		});
	}

	User.findByIdAndUpdate(
		req.params._id,
		{
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email: req.body.email
		})
		.then(data => {
			if (!data) {
				response.status = 404;
				response.message = "Invalid id";
				response.error.type = "invalid id";
				response.error.message = `Cannot update user with id=${id}.`;
				res.status(response.status).send(response);
			} else {
				response.message = 'User was updated successfully.';
				response.result = data;
				response.length = 1;
				res.send(response)
			}
		})
		.catch(err => {
			response.status = 500;
			response.message = "Invalid id";
			response.error.type = "invalid id";
			response.error.message = `Error updating user with id=${id}.`;
			res.status(200).send(response);
		});
}

exports.getUserById = async (req, res) => {

	User.find({
		_id: req.params._id
	})
		.then(data => {
			console.log(data)
			const user = {
				_id: data[0]._id,
				email: data[0].email,
				first_name: data[0].first_name || "",
				last_name: data[0].last_name || "",
				username: data[0].username
			}
			response.result = user,
				response.message = "Success get user data"
			res.status(200).send(response)
		})
		.catch(err => {
			response.status = 500;
			response.message = "Some error occurred while retrieving get user.";
			response.error.type = "Invalid id";
			response.error.message = "Some error occurred while retrieving get user.";
			res.status(response.status).send(response);
			res.status(500).send({
				message: 'Failed to get user for selected id.',
			});
		});
} 
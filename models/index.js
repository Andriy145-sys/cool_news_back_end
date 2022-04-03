const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.posts = require("./posts")(mongoose);
db.user = require("./user")(mongoose)

module.exports = db;
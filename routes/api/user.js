const express = require("express")
const router = express.Router()

const user = require("../../controller/user.controller");

router.post("/update/:_id", user.updateUserData);

router.post("/change_password/:_id", user.changePassword);

router.get("/:_id", user.getUserById);

module.exports = router
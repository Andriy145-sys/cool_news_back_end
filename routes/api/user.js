const express = require("express")
const router = express.Router()

const user = require("../../controller/user.controller");

router.post("/sign_up", user.create);

router.post("/sign_in" , user.login);

router.post("/update/:_id", user.updateUserData);

router.post("/change_password/:_id", user.changePassword);

router.get("/user/:_id", user.getUserById);

module.exports = router
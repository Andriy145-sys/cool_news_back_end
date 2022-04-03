const express = require("express")
const router = express.Router()

const auth = require("../../controller/auth.controller");

router.post("/sign_up", auth.create);

router.post("/sign_in" , auth.login);

module.exports = router
const express = require("express");
const router = express.Router();
const userSignup = require("../../controllers/user/userSignup");
const userLogin = require("../../controllers/user/userLogin");

router.get("/", userLogin.getLanding);
router.get("/category", userLogin.getCategory);
router.get("/signup", userSignup.getSignup);
router.get("/login",userLogin.getLogin)
router.get("/contact",userLogin.getContact)

router.post("/",userSignup.postSignup)
router.post("/home",userLogin.postHome)
module.exports = router;

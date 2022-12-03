const express = require("express");
const router = express.Router();
const userSignup = require("../../controllers/user/userSignup");
const userLogin = require("../../controllers/user/userLogin");
const verifyUser = require("../../middlewares/Session")

router.get("/", userLogin.getLanding);
router.get("/shop",userLogin.getShop);
router.get("/signup",verifyUser.verifyUser, userSignup.getSignup);
router.get("/login", userLogin.getLogin);
router.get("/contact", userLogin.getContact);
router.get("/home", userLogin.getHome);
router.get("/otp", userSignup.getOtp);
router.get("/logout",userLogin.getLogout)
router.get("/productDetails",userLogin.getProductDetails)

router.post("/", userSignup.postSignup);
router.post("/home", userLogin.postHome);
router.post("/otp",userSignup.postOtp)

module.exports = router;

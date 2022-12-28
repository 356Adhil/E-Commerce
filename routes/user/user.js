const express = require("express");
const router = express.Router();
const userSignup = require("../../controllers/user/userSignup");
const userLogin = require("../../controllers/user/userLogin");
const cart = require("../../controllers/user/cart");
const verifyUser = require("../../middlewares/Session");
const verifyUserCart = require("../../middlewares/Session");
const { Router } = require("express");

router.get("/", userLogin.getLanding);

router.get("/shop", userLogin.getShop);

router.get("/signup", verifyUser.verifyUser, userSignup.getSignup);

router.get("/login", userLogin.getLogin);

router.get("/contact", userLogin.getContact);

router.get("/home", userLogin.getHome);

router.get("/otp", userSignup.getOtp);

router.get("/logout", userLogin.getLogout);

router.get("/productDetails/", userLogin.getProductDetails);

router.get("/cart", cart.getCart);

router.get("/checkout", verifyUser.verifyUserCart, cart.getCheckout);

router.get("/profile", verifyUser.verifyUserCart, userSignup.getProfile);

router.get("/wishlist", cart.getWishList);

router.get("/add-wishList/:id", cart.getAddWishList);

router.get("/orders", verifyUser.verifyUserCart, userSignup.getOrderDetails);

router.get("/order-product-details", userSignup.getOrderProductDetails);

router.get("/forgotPassword", userSignup.getForgotPassword);

router.post("/forgotPassword", userSignup.postForgotPassword);

router.post("/forgotPassOtp", userSignup.postForgotPassOtp);

router.post("/resetPass", userSignup.postResetPass);

router.post("/orderconfirmed", cart.ProceedtoPay);

router.post("/verifyPayment", cart.verifyPayment);

router.get("/paymentFail", cart.paymentFailure);

router.get("/confirmation/:oid", cart.confirmation);

router.post("/addAddress", cart.addAddress);

router.get("/add-cart/:id", cart.getAddCart);

router.post("/changeQty", cart.changeQuantity);
// router.get("/deleteCartProduct/:id",cart.deleteCartProduct)

router.post("/removeProduct", cart.postremoveProduct);

router.post("/", userSignup.postSignup);

router.post("/home", userLogin.postHome);

router.post("/otp", userSignup.postOtp);

router.post("/couponcheck", userSignup.couponCheck);

module.exports = router;

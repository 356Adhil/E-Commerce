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

// router.get("/contact", userLogin.getContact);

router.get("/profileDetails",userSignup.profileDetails)

router.get("/editAccount",userSignup.getEditAccount)

router.post('/postEditAccount',userSignup.postEditAccount);

router.get("/home", userLogin.getHome);

router.get("/otp", userSignup.getOtp);

router.get("/logout", userLogin.getLogout);

router.get("/productDetails/", userLogin.getProductDetails);

router.get("/cart",verifyUser.verifyUserCart, cart.getCart);

router.get("/checkout", verifyUser.verifyUserCart, cart.getCheckout);

router.get("/profile", verifyUser.verifyUserCart, userSignup.getProfile);

router.get("/wishlist",verifyUser.verifyUserCart, cart.getWishList);

router.get("/add-wishList/:id",verifyUser.verifyUserCart, cart.getAddWishList);

router.get("/orders", verifyUser.verifyUserCart, userSignup.getOrderDetails);

router.get("/order-product-details/:id",verifyUser.verifyUserCart, userSignup.getOrderProductDetails);

router.get("/forgotPassword", userSignup.getForgotPassword);

router.post("/forgotPassword", userSignup.postForgotPassword);

router.post("/forgotPassOtp", userSignup.postForgotPassOtp);

router.post("/resetPass", userSignup.postResetPass);

router.post("/orderconfirmed", cart.ProceedtoPay);

router.post("/verifyPayment", cart.verifyPayment);

router.get("/paymentFail",verifyUser.verifyUserCart, cart.paymentFailure);

router.get("/confirmation/:oid",verifyUser.verifyUserCart, cart.confirmation);

router.post("/addAddress", cart.addAddress);

router.get("/add-cart/:id",verifyUser.verifyUserCart, cart.getAddCart);

router.post("/changeQty", cart.changeQuantity);
// router.get("/deleteCartProduct/:id",cart.deleteCartProduct)

router.post("/removeProduct", cart.postremoveProduct);

router.post("/removeWishProduct", cart.removeWishProduct);

router.post("/", userSignup.postSignup);

router.post("/home", userLogin.postHome);

router.post("/otp", userSignup.postOtp);

router.post("/couponcheck", userSignup.couponCheck);

module.exports = router;

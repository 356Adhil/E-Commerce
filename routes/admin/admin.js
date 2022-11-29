const express = require("express");
const router = express.Router();
const adminLogin = require("../../controllers/admin/adminLogin");
const addProduct = require("../../controllers/admin/addProduct");

router.get("/",adminLogin.getAdmin)
router.post("/",adminLogin.postAdmin)
router.get("/home",adminLogin.getHome)
router.get("/userDetails",adminLogin.getTable)
router.get("/blockAction/:id",adminLogin.blockUser)
router.get("/unBlockAction/:id",adminLogin.unBlockUser)
router.get("/addProduct",addProduct.getAddProduct)
router.post("/addProduct",addProduct.postAddProduct)
router.get("/product",adminLogin.getProduct)

module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer")
const {storage} = require("../../middlewares/multer")

const adminLogin = require("../../controllers/admin/adminLogin");
const addProduct = require("../../controllers/admin/addProduct");
const editProduct = require("../../controllers/admin/editProduct")
const deleteProduct = require("../../controllers/admin/deleteProduct")
const category = require("../../controllers/admin/category")
const upload = multer({storage})
const banner = require("../../controllers/admin/banner")
const verifyAdmin = require("../../middlewares/Session")


router.get("/", adminLogin.getAdmin);
router.post("/", adminLogin.postAdmin);
router.get("/home",verifyAdmin.verifyAdmin1, adminLogin.getHome);
router.get("/userDetails",verifyAdmin.verifyAdmin1,adminLogin.getTable);
router.get("/blockAction/:id",adminLogin.blockUser);
router.get("/unBlockAction/:id",adminLogin.unBlockUser);
router.get("/addProduct",verifyAdmin.verifyAdmin1, addProduct.getAddProduct);
router.post("/addProduct",upload.array('myFiles',12),addProduct.postAddProduct);
router.get("/product",verifyAdmin.verifyAdmin1, adminLogin.getProduct);
router.get("/logout", adminLogin.getLogout);
router.get("/editProduct/:id",verifyAdmin.verifyAdmin1,editProduct.getEditProduct)
router.post("/editProduct/:id",upload.array('myFiles',12),editProduct.postEditProduct)
router.get("/deleteProduct/:id",deleteProduct.deleteProduct)
router.get("/banner",verifyAdmin.verifyAdmin1,banner.getBanner)
router.get("/addBanner",verifyAdmin.verifyAdmin1,banner.getAddBanner)
router.post("/addBanner",upload.array('img',12),banner.postAddBanner)

/* ---------------------category-------------------------------------- */
router.get('/category',verifyAdmin.verifyAdmin1,category.getCategory)
router.get("/addCategory",verifyAdmin.verifyAdmin1,category.getAddCategory)
router.post("/addCategory",category.postAddCategory)
router.get("/editCategory/:id",verifyAdmin.verifyAdmin1,category.getEditCategory)
router.post("/editCategory/:id",category.postEditCategory)

module.exports = router;

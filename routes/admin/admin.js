const express = require("express");
const router = express.Router();
const adminLogin = require("../../controllers/admin/adminLogin");
const addProduct = require("../../controllers/admin/addProduct");
const editProduct = require("../../controllers/admin/editProduct")
const deleteProduct = require("../../controllers/admin/deleteProduct")
const category = require("../../controllers/admin/category")
const upload = require("../../middlewares/multer")


router.get("/", adminLogin.getAdmin);
router.post("/", adminLogin.postAdmin);
router.get("/home", adminLogin.getHome);
router.get("/userDetails", adminLogin.getTable);
router.get("/blockAction/:id", adminLogin.blockUser);
router.get("/unBlockAction/:id", adminLogin.unBlockUser);
router.get("/addProduct", addProduct.getAddProduct);
router.post("/addProduct",upload.single('myFiles'),addProduct.postAddProduct);
router.get("/product", adminLogin.getProduct);
router.get("/logout", adminLogin.getLogout);
router.get("/editProduct/:id",editProduct.getEditProduct)
router.post("/editProduct/:id",editProduct.postEditProduct)
router.get("/deleteProduct/:id",deleteProduct.deleteProduct)

/* ---------------------category-------------------------------------- */
router.get('/category',category.getCategory)
router.get("/addCategory",category.getAddCategory)
router.post("/addCategory",category.postAddCategory)
router.get("/editCategory/:id",category.getEditCategory)
router.post("/editCategory/:id",category.postEditCategory)

module.exports = router;

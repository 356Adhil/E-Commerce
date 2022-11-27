const express = require("express");
const router = express.Router();
const adminLogin = require("../../controllers/admin/adminLogin");

router.get("/",adminLogin.getAdmin)
router.post("/",adminLogin.postAdmin)
router.get("/home",adminLogin.getHome)
router.get("/userDetails",adminLogin.getTable)
module.exports = router;
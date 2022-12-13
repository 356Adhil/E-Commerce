const { response } = require("express");
const admin = require("../../models/adminLogin");
const User = require("../../models/signUp");
const product = require("../../models/product");

module.exports = {
  getAdmin: (req, res) => {
    if(req.session.adminEmail){
      res.redirect("/admin/home")
    }
    res.render("admin/login");
  },

  postAdmin: async (req, res) => {
    try {
      let adminData = req.body;
      const findAdmin = await admin.find({
        email: adminData.email,
        password: adminData.password,
      });
      if (findAdmin) {
        const adminId = await admin.findOne({email: adminData.email})
        req.session.adminLoggedIn = true;
        req.session.adminId = adminId._id;
        req.session.adminEmail = req.body.email;
        res.redirect("/admin/home");
      } else {
        res.redirect("/admin/login")
        console.log("Something Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  },

  getTable: async (req, res) => {
    const userData = await User.find();
    res.render("admin/table", { users: userData });
  },

  getHome: (req, res) => {
    res.render("admin/home");
  },

  blockUser: async (req, res) => {
    console.log("Set");
    const id = req.params.id;
    console.log(id);
    try {
      const block = await User.findByIdAndUpdate(id, { status: false });
      res.redirect("/admin/userDetails");
    } catch (error) {
      console.log(error);
    }
  },

  unBlockUser: async (req, res) => {
    console.log("Set");
    const id = req.params.id;
    console.log(id);
    try {
      const unBlock = await User.findByIdAndUpdate(id, { status: true });
      res.redirect("/admin/userDetails");
    } catch (error) {
      console.log(error);
    }
  },

  getProduct: async (req, res) => {
    const productData = await product.find();
    res.render("admin/products", { product: productData });
  },

  getLogout:(req,res)=>{
    req.session.destroy((err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("Admin Logout Successfull");
        res.redirect("/admin")
      }
    })
  }
};

const { response } = require("express");
const admin = require("../../models/adminLogin");
const User = require("../../models/signUp");
const product = require("../../models/product");

module.exports = {
  getAdmin: (req, res) => {
    res.render("admin/login");
  },

  postAdmin: async (req, res) => {
    let adminData = req.body;
    const findAdmin = await admin.find({
      email: adminData.email,
      password: adminData.password,
    });
    if (findAdmin) {
      res.redirect("/admin/home");
    } else {
      console.log("Something Wrong");
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
};

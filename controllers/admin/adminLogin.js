const { response } = require("express");
const admin = require("../../models/adminLogin");
const User = require("../../models/signUp");

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
};

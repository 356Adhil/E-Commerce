const { response } = require("express");
const User = require("../../models/signUp");
const bcrypt = require("bcrypt")

module.exports = {
  getLanding: (req, res) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      res.render("user/LandingIndex");
    }
  },

  getCategory: (req, res) => {
    res.render("user/category");
  },

  getLogin: (req, res) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      res.render("user/login");
    }
  },

  getHome: (req, res) => {
    if (req.session.email) {
      res.render("user/home");
    } else {
      res.redirect("/login");
    }
  },

  postHome: async (req, res) => {
    const userData = req.body;
    const user = await User.findOne({
      email: userData.email,
    });
    if (user) {
      let status = await bcrypt.compare(userData.password, user.password);
      if (status) {
        req.session.loggedIn = true;
        req.session.email = req.body.email;
        console.log("its here");
        res.redirect("/login");
        console.log(req.session.email);
      } else {
        res.redirect("/home");
        console.log("invalid Entry");
      }
    }
  },

  getContact: (req, res) => {
    res.render("user/contact");
  },
};

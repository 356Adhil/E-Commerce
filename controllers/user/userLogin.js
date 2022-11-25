const { response } = require("express");
const User = require("../../models/signUp");

module.exports = {
  getLanding: (req, res) => {
    res.render("user/LandingIndex");
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

  postHome: (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email, password: password })
      .then((result) => {
        if (result) {
          req.session.loggedIn = true;
          req.session.email = req.body.email;
          console.log('its here');
          res.redirect("/login");
          console.log(req.session.email);
        } else {
          res.redirect("/home");
          console.log("invalid Entry");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getContact: (req, res) => {
    res.render("user/contact");
  },
};

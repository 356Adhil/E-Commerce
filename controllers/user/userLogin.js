const { response } = require("express");
const User = require("../../models/signUp");
const bcrypt = require("bcrypt");
const product = require("../../models/product");
const category = require("../../models/category");

let msg = "";

module.exports = {
  getLanding: (req, res) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      res.render("user/LandingIndex");
    }
  },

  getShop: async(req, res) => {
    let user = req.session.email;
    const productData = await product.find();
    const categoryData = await category.find();
    res.render("user/shop",{user, product: productData, category: categoryData  });
  },

  getLogin: (req, res) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      res.render("user/login");
    }
  },

  getLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("logout successfully");
        res.redirect("/");
      }
    });
  },

  getHome:async (req, res) => {
    if (req.session.email) {
      let user = req.session.email;
      const productData = await product.find();
      res.render("user/home", { user, product: productData });
    } else {
      res.redirect("/login");
    }
  },

  postHome: async (req, res) => {
    const userData = req.body;
    const user = await User.findOne({
      email: userData.email,
    });
    console.log(user);
    if (user) {
      let Status = await bcrypt.compare(userData.password, user.password);
      console.log(Status);
      if (Status) {
        if (user.status === true) {
          req.session.loggedIn = true;
          req.session.email = req.body.email;
          console.log("its here");
          res.redirect("/login");
          console.log(req.session.email);
        } else if (user.status === false) {
          msg = "Your Account Has been Blocked";
          res.redirect("/login");
        }
      } else {
        res.redirect("/home");
        console.log("invalid Entry 1st");
      }
    } else {
      res.redirect("/home");
      console.log("invalid Entry 2nd");
    }
  },

  getContact: (req, res) => {
    res.render("user/contact");
  },

  getProductDetails: async(req, res) => {
    let user = req.session.email;
    const productData = await product.find();
    const categoryData = await category.find();
    res.render("user/productDetails",{user, product: productData, category: categoryData  });
  },
};

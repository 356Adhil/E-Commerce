const { response } = require("express");
const User = require("../../models/signUp");
const bcrypt = require("bcrypt");
const product = require("../../models/product");
const category = require("../../models/category");
const banner = require("../../models/banner")
const cart = require("../../models/cart");
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let msg = "";

module.exports = {
  getLanding: async (req, res) => { 
    if (req.session.email) {
      res.redirect("/home");
    } else {
      const productData = await product.find();
      const bannerData = await banner.find();
      res.render("user/LandingIndex",{ product: productData, banner: bannerData });
    }
  },

  getShop: async(req, res) => {
    try {
      let user = req.session.email;
      const productData = await product.find();
      const categoryData = await category.find();
      let cartCount = 0;
      let Cart = await cart.findOne({user_Id:ObjectId(req.session.userId)})
      console.log("Cart Exist"+Cart);
      if(Cart){
        cartCount = Cart.products.length
      }
      res.render("user/shop",{user, product: productData, category: categoryData, cartCount });
    } catch (error) {
      console.log(error);
    }
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
        console.log("logout successfull");
        res.redirect("/");
      }
    });
  },

  getHome:async (req, res) => {
    try {
      if (req.session.email) {
        let user = req.session.email;
        const productData = await product.find();
        const bannerData = await banner.find(); 
        let cartCount = 0;
        let Cart = await cart.findOne({user_Id:ObjectId(req.session.userId)})
        console.log("Cart Exist"+Cart);
        if(Cart){
          cartCount = Cart.products.length
        }
        res.render("user/home", { user, product: productData, banner: bannerData , cartCount});
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
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
          const userId = await User.findOne({email: userData.email})
          console.log(userId);
          req.session.loggedIn = true;
          req.session.userId = userId._id
          req.session.email = req.body.email;
          console.log("result"+req.session.userId);
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

  // getContact: (req, res) => {
  //   res.render("user/contact");
  // },

  getProductDetails: async(req, res) => {
    try {
      const allProducts = await product.find()
      const id = req.query.id
      let user = req.session.email;
      const productData = await product.find({_id:id})
      console.log("product data",productData);
      let cartCount = 0;
      let Cart = await cart.findOne({user_Id:ObjectId(req.session.userId)})
      console.log("Cart Exist"+Cart);
      if(Cart){
        cartCount = Cart.products.length
      }
      res.render("user/productDetails",{allProducts, productData, user, cartCount})
    } catch (error) {
      console.log(error.message);
    }
  }
}

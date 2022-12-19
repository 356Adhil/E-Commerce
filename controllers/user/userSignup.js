const { response } = require("express");
const User = require("../../models/signUp");
const cart = require("../../models/cart")

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
let username;
let email;
let mobile;
let password;

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "officialrightfit@gmail.com",
    pass: "qzmdlyemyjxczjia",
  },
});
const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

module.exports = {
  getSignup: (req, res) => {
    res.render("user/signup");
  },

  postSignup: async (req, res) => {
    username = req.body.username;
    email = req.body.email;
    mobile = req.body.phone;
    password = await bcrypt.hash(req.body.password, 10);

    let mailDetails = {
      from: "officialrightfit@gmail.com",
      to: email,
      subject: "RIGHT FIT ACCOUNT REGISTRATION",
      html: `<p>YOUR OTP FOR REGISTERING IN RIGHT FIT IS <br><h1>${OTP}</h1></p>`,
    };

    const user = await User.findOne({ email: email });
    if (user) {
      res.redirect("/signup");
    } else {
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email Sent Successfully");
          res.redirect("/otp");
        }
      });
    }
  },

  getOtp: (req, res) => {
    if (req.session.email) {
      res.redirect("/home");
    } else {
      res.render("user/otp");
    }
  },

  postOtp: async (req, res) => {
    let { otp } = req.body;
    if (OTP === otp) {
      try {
        const user = await User.create({
          username: username,
          email: email,
          mobile: mobile,
          password: password,
        });
      } catch (error) {
        console.log(error);
      }
      console.log("its here post otp");
      res.redirect("/login");
    } else {
      res.redirect("/otp");
    }
  },

  getProfile: async (req,res)=>{
    let cartCount = 0;
    let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
    console.log("Cart Exist");
    if (Cart) {
      cartCount = Cart.products.length;
    }
    const user = req.session.email
    res.render("user/profile",{user, cartCount})
  },
};

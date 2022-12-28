const { response } = require("express");
const User = require("../../models/signUp");
const cart = require("../../models/cart");
const coupon = require("../../models/coupon");

require("dotenv").config();

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const order = require("../../models/order");
const ObjectId = mongoose.Types.ObjectId;
let username;
let email;
let mobile;
let password;

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASS,
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
      from: process.env.NODEMAILER_USER_EMAIL,
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

  getProfile: async (req, res) => {
    let cartCount = 0;
    let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
    console.log("Cart Exist");
    if (Cart) {
      cartCount = Cart.products.length;
    }
    const user = req.session.email;
    res.render("user/profile", { user, cartCount });
  },

  getOrderDetails: async (req, res) => {
    try {
      const user = req.session.email;
      const userId = req.session.userId;
      let cartCount = 0;
      let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
      console.log("Cart Exist");
      if (Cart) {
        cartCount = Cart.products.length;
      }

      let orderDetails = await order.find({user_Id:ObjectId(userId)});
      res.render("user/orderDetails", { orderDetails, user, cartCount });
    } catch (error) {
      console.log(error);
    }
  },

  getOrderProductDetails: (req, res) => {
    try {
      res.render("user/orderProductDetails");
    } catch (error) {
      console.log(error);
    }
  },

  getForgotPassword: (req, res) => {
    try {
      res.render("user/forgotPass");
    } catch (error) {
      console.log(error);
    }
  },

  postForgotPassword: async (req, res) => {
    try {
      let email = req.body.email;

      let userData = await User.findOne({ email: email });
      if (userData) {
        console.log(email);

        let mailDetails = {
          from: process.env.NODEMAILER_USER_EMAIL,
          to: email,
          subject: "RIGHT FIT ACCOUNT REGISTRATION",
          html: `<p>YOUR OTP FOR REGISTERING IN RIGHT FIT IS <br><h1>${OTP}</h1></p>`,
        };
        console.log(mailDetails);

        mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log("Email Sent Successfully");
            res.render("user/forgotPassOtp", { email });
          }
        });
      } else {
        res.redirect("/forgotPass");
      }
    } catch (error) {
      console.log(error);
    }
  },

  postForgotPassOtp: (req, res) => {
    try {
      let { otp } = req.body;
      if (OTP === otp) {
        res.render("user/resetPass");
      }
    } catch (error) {
      console.log(error);
      //  res.render('500');
    }
  },

  postResetPass: async (req, res) => {
    try {
      let data = req.body;
      let email = req.body.email;
      if (data.newpassword && data.confirmpassword) {
        if (data.newpassword === data.confirmpassword) {
          let newPassword = await bcrypt.hash(data.newpassword, 10);

          User.updateOne(
            { email: email },
            {
              $set: {
                password: newPassword,
              },
            }
          ).then(() => {
            res.redirect("/login");
          });
        } else {
          res.render("user/resetPass", { email });
        }
      } else {
        res.render("user/resetPass", { email });
      }
    } catch (error) {
      console.log(error);
      //  res.render('500');
    }
  },

  couponCheck: async (req, res) => {
    const uid = ObjectId(req.session.userId);
    const { code, amount } = req.body;
    const check = await coupon.findOne({ couponName: code });
    if (check) {
      console.log("Checked ............");
      console.log(req.body.userId);
      const existingUser = await coupon
        .findOne({ couponName: code, users: ObjectId(req.body.userId) })

        .then((data, err) => {
          if (data) {
            res.json([{ success: false, message: "Coupon already used" }]);
          } else {
            let discount = 0;
            const off = (Number(amount) * Number(check.discount)) / 100;
            if (off > Number(check.maxLimit)) {
              discount = Number(check.maxLimit);
            } else {
              discount = off;
            }
            res.json([
              {
                success: true,
                dis: discount,
                code,
              },
              { check },
            ]);
          }
        });
    } else {
      res.json([{ success: false, message: "Coupon invalid" }]);
    }
  },
};

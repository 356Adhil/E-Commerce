const { response } = require("express");
const User = require("../../models/signUp");
const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "356adhil@gmail.com",
    pass: "ilbjysyucyhiltbf",
  },
});
const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

module.exports = {
  getSignup: (req, res) => {
    res.render("user/signup");
  },

  postSignup: async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let mobile = req.body.phone;
    let password = req.body.password;

    let mailDetails = {
      from: "356adhil@gmail.com",
      to: email,
      subject: "KARMA ACCOUNT REGISTRATION",
      html: `<p>YOUR OTP FOR REGISTERING IN KARMA IS ${OTP}</p>`,
    };

    const user = await User.findOne({ email: email });
    if (user) {
      res.redirect("/signup");
    } else {
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

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email Sent Successfully");
          res.redirect("/otp");
        }
      });
    }

    // try {
    //   const user = await User.create({
    //     username: username,
    //     email: email,
    //     mobile: mobile,
    //     password: password,
    //   });
    //   res.redirect("/otp");
    // } catch (error) {
    //   console.log(error);
    // }
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
      res.redirect("/login");
    } else {
      res.redirect("/otp");
    }
  },
};

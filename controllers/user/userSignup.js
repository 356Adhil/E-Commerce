const { response } = require("express");
const User = require("../../models/signUp");

module.exports = {
  getSignup: (req, res) => {
    res.render("user/signup");
  },

  postSignup: async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let mobile = req.body.phone;
    let password = req.body.password;

    try {
      const user = await User.create({
        username: username,
        email: email,
        mobile: mobile,
        password: password,
      });
      res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  },
};

const { response } = require("express");

module.exports = {
  getLanding: (req, res) => {
    res.render("user/LandingIndex");
  },

  getCategory: (req, res) => {
    res.render("user/category");
  },

  getSample: (req,res)=>{
    res.render("user/Sample")
  },

    getLogin: (req, res) => {
    res.render("user/login");
  },
  
  postHome: (req,res)=>{
    res.render("user/LandingIndex")
  },

  getContact:(req,res)=>{
    res.render("user/contact")
  }
};

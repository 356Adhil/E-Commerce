const { response } = require("express");
const admin = require("../../models/adminLogin");
const User = require("../../models/signUp");
const product = require("../../models/product");
const order = require("../../models/order");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment")


module.exports = {
  getAdmin: (req, res) => {
    if (req.session.adminEmail) {
      res.redirect("/admin/home");
    }
    res.render("admin/login");
  },

  postAdmin: async (req, res) => {
    try {
      let adminData = req.body;
      const findAdmin = await admin.find({
        email: adminData.email,
        password: adminData.password,
      });
      if (findAdmin) {
        const adminId = await admin.findOne({ email: adminData.email });
        req.session.adminLoggedIn = true;
        req.session.adminId = adminId._id;
        req.session.adminEmail = req.body.email;
        res.redirect("/admin/home");
      } else {
        res.redirect("/admin/login");
        console.log("Something Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  },

  getTable: async (req, res) => {
    const userData = await User.find();
    res.render("admin/table", { users: userData });
  },

  getHome: async (req, res) => {
    try {
      const productCount = await product.find().count();
      const orderCount = await order.find().count();
      const userCount = await User.find().count();
      const orderData = await order.find()
      
      const totalAmount = orderData.reduce((accumulator, object) => {
        return (accumulator += object.totalAmount);
    }, 0);

      res.render("admin/home", { productCount, orderCount, userCount, totalAmount });
    } catch (error) {
      console.log(error);
    }
  },

  blockUser: async (req, res) => {
    const id = req.params.id;
    try {
      const block = await User.findByIdAndUpdate(id, { status: false });
      res.redirect("/admin/userDetails");
    } catch (error) {
      console.log(error);
    }
  },

  unBlockUser: async (req, res) => {
    const id = req.params.id;
    try {
      const unBlock = await User.findByIdAndUpdate(id, { status: true });
      res.redirect("/admin/userDetails");
    } catch (error) {
      console.log(error);
    }
  },

  getProduct: async (req, res) => {
    const productData = await product.find();
    res.render("admin/products", { product: productData });
  },

  getLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Admin Logout Successfull");
        res.redirect("/admin");
      }
    });
  },

  getOrder:async (req, res) => {
    try {
      let orderDetails = await order.find()
      res.render("admin/orders",{orderDetails});
    } catch (error) {
      console.log(error);
    }
  },

  getOrderDetail: async (req,res)=>{
    try {
      const id = req.params.id
      console.log(id);
      let orderDetails = await order.aggregate([
        { $match: { _id:ObjectId(id) } },
        { $unwind: "$orderItem" },
        {
          $project: {
            products: "$orderItem.product_Id",
            quantity: "$orderItem.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products",
            foreignField: "_id",
            as: "productData",
          },
        },
        {
          $project: {
            products: 1,
            quantity: 1,
            productData: { $arrayElemAt: ["$productData", 0] },
          },
        },
      ])
      console.log("ithhanu order details....");
      console.log(orderDetails);
      res.render('admin/orderDetails',{orderDetails})
    } catch (error) {
      console.log(error);
    }
  },

  getSales:async (req,res)=>{
    try {
      const monthstart = moment().startOf('month');
      const monthend = moment().endOf('month');
      
      const monthReport = await order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: monthstart.toDate(),
                    $lte: monthend.toDate(),
                },
            },
        },
        {
            $lookup:
            {
                from: 'users',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'user',
            },
        },
        {
            $project: {
                order_id: 1,
                user: 1,
                paymentStatus: 1,
                totalAmount: 1,
                orderStatus: 1,
            },
        },
    ]);
      let orderDetails = await order.find()
      res.render("admin/salesReport",{orderDetails,  month: monthReport});
    } catch (error) {
      console.log(error);
    }
  }
};
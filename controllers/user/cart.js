const User = require("../../models/signUp");
const cart = require("../../models/cart");
const product = require("../../models/product");
const category = require("../../models/category");
const order = require("../../models/order");
const wishlist = require("../../models/wishList")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment")

module.exports = {
  getCart: async (req, res) => {
    console.log("cart list page");
    const user = req.session.userId;
    const userId = req.session.userId;
    console.log("userid" + userId);
    try {
      let cartCount = 0;
      let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
      console.log("Cart Exist");
      if (Cart) {
        cartCount = Cart.products.length;
      }
      let getProducts = await cart.aggregate([
        { $match: { user_Id: ObjectId(userId) } },

        {
          $unwind: "$products",
        },
        {
          $project: {
            products: "$products.product_Id",
            quantity: "$products.quantity",
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
      ]);

      if (getProducts.length >= 1) {
        let singleProductPrice = await cart.aggregate([
          { $match: { user_Id: ObjectId(userId) } },
          { $unwind: "$products" },
          {
            $project: {
              products: "$products.product_Id",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "products",
              foreignField: "_id",
              as: "ProductData",
            },
          },
          { $unwind: "$ProductData" },

          {
            $project: {
              total: { $multiply: ["$quantity", "$ProductData.price"] },
            },
          },
          { $project: { _id: 0, total: 1 } },
        ]);

        // ------------------------------------- Get total price ------------------------------------ //

        let totalPrice = await cart.aggregate([
          { $match: { user_Id: ObjectId(userId) } },

          {
            $unwind: "$products",
          },
          {
            $project: {
              products: "$products.product_Id",
              quantity: "$products.quantity",
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
          {
            $group: {
              _id: null,
              totalAmount: {
                $sum: { $multiply: ["$quantity", "$productData.price"] },
              },
            },
          },
          { $project: { _id: 0, totalAmount: 1 } },
        ]);

        console.log(totalPrice[0].totalAmount);
        const total = totalPrice[0].totalAmount;
        res.render("user/cart", {
          getProducts,
          userId,
          total,
          singleProductPrice,
          user,
          cartCount,
        });
      } else {
        res.render("user/emptyCart", { user, cartCount });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // --------------------- Add to Cart -------------------------//

  getAddCart: async (req, res) => {
    try {
      console.log("user cart get page");

      const productId = req.params.id;
      const userId = req.session.userId;
      console.log("user_id :" + userId);
      console.log(`product_id:${productId}`);
      // initially user doesn't have cart .we have to check whether the user has cart or not
      let userCart = await cart.findOne({ user_Id: ObjectId(userId) });

      //    check whether user has cart or not
      if (userCart) {
        const product_Exist = await cart.findOne({
          products: { $elemMatch: { product_Id: productId } },
        });

        if (product_Exist) {
          addOneProduct(userId, productId);
          console.log(addOneProduct);
        }
        // if there is no products in cart=>create new product in cart(by updating cart)
        else {
          let createNewProduct = await cart
            .updateOne(
              { user_Id: userId },
              { $push: { products: { product_Id: productId } } }
            )
            .then(() => {
              res.json({ status: true });
            });
        }
      }
      // user has not cart, create new Cart
      // console.log("user has not cart")
      else {
        let createCart = await cart
          .create({
            user_Id: userId,
            products: [
              {
                product_Id: productId,
                quantity: 1,
              },
            ],
          })
          .then(() => {
            res.json({ status: true });
          });
      }

      async function addOneProduct(userId, productId) {
        let updateCart = await cart.updateOne(
          {
            user_Id: userId,
            products: { $elemMatch: { product_Id: productId } },
          },
          { $inc: { "products.$.quantity": 1 } }
        );
        console.log("updated");
      }
      // res.redirect("/home")
    } catch (error) {
      console.log(error);
    }
  },

  // ------------------------------- Changing product Qty & price -------------------- //

  changeQuantity: async (req, res) => {
    try {
      const cartId = req.body.cart;
      const productId = req.body.product;
      const quantity = parseInt(req.body.quantity);
      const count = parseInt(req.body.count);

      let userProdExist = await cart.findOne({
        _id: cartId,
        products: { $elemMatch: { product_Id: productId } },
      });
      if (userProdExist) {
        let changePrdQty = await cart
          .updateOne(
            {
              _id: cartId,
              products: { $elemMatch: { product_Id: productId } },
            },
            { $inc: { "products.$.quantity": count } }
          )
          .then(() => {
            res.json({ status: true });
          });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // ------------------------------ Checkout --------------------------- //

  getCheckout: async (req, res) => {
    try {
      const user = req.session.email;
      const userId = req.session.userId;
      let userData = await User.findOne({ email: user });

      let totalPrice = await cart.aggregate([
        { $match: { user_Id: ObjectId(userId) } },

        {
          $unwind: "$products",
        },
        {
          $project: {
            products: "$products.product_Id",
            quantity: "$products.quantity",
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
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: { $multiply: ["$quantity", "$productData.price"] },
            },
          },
        },
        { $project: { _id: 0, totalAmount: 1 } },
      ]);
      let cartCount = 0;
      let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
      console.log("Cart Exist" + Cart);
      if (Cart) {
        cartCount = Cart.products.length;
      }

      let getProducts = await cart.aggregate([
        { $match: { user_Id: ObjectId(userId) } },

        {
          $unwind: "$products",
        },
        {
          $project: {
            products: "$products.product_Id",
            quantity: "$products.quantity",
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
      ]);

      if (getProducts.length >= 1) {
        let singleProductPrice = await cart.aggregate([
          { $match: { user_Id: ObjectId(userId) } },
          { $unwind: "$products" },
          {
            $project: {
              products: "$products.product_Id",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "products",
              foreignField: "_id",
              as: "ProductData",
            },
          },
          { $unwind: "$ProductData" },

          {
            $project: {
              total: { $multiply: ["$quantity", "$ProductData.price"] },
            },
          },
          { $project: { _id: 0, total: 1 } },
        ]);

        console.log("Checkout page rendered.........");
        const shippingCharge = 55;
        totalPrice = totalPrice[0].totalAmount;
        netPrice = totalPrice + shippingCharge;
        const addressData = userData.addressDetails;
        res.render("user/checkout", {
          user,
          cartCount,
          addressData,
          totalPrice,
          netPrice,
          singleProductPrice,
          getProducts,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  // --------------------------------- Proceed To Pay -------------------------- //

  ProceedtoPay: async (req, res) => {
    try {
      const user = req.session.email;
      const userId = req.session.userId;
      let cartCount = 0;
      let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
      console.log("Cart Exist" + Cart);
      if (Cart) {
        cartCount = Cart.products.length;
      }
      let userData = await User.findOne({ email: user });

      let getProducts = await cart.aggregate([
        { $match: { user_Id: ObjectId(userId) } },

        {
          $unwind: "$products",
        },
        {
          $project: {
            products: "$products.product_Id",
            quantity: "$products.quantity",
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
      ]);
      

      let productData = await cart.aggregate([
        { $match: { user_Id: ObjectId(userId) } },
      ]);

      let totalPrice = await cart.aggregate([
        { $match: { user_Id: ObjectId(userId) } },

        {
          $unwind: "$products",
        },
        {
          $project: {
            products: "$products.product_Id",
            quantity: "$products.quantity",
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
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: { $multiply: ["$quantity", "$productData.price"] },
            },
          },
        },
        { $project: { _id: 0, totalAmount: 1 } },
      ]);

      /* -----------Creating-Order-------------- */
      const paymentMethod = req.body["payment-method"];
      const orderItem = productData[0].products;
      const totalAmount = totalPrice[0].totalAmount;
      const orderStatus = paymentMethod == "COD" ? "placed" : "pending";
      const address = req.body.address;

      const createOrder = await order
        .create({
          user_Id: ObjectId(userId),
          paymentMethod: paymentMethod,
          address: address,
          orderStatus: orderStatus,
          orderOn: moment().format("MMM Do YY"),
          deliveryDate:moment().add(3,"days").format("MMM Do YY"),
          totalAmount: totalAmount,
          orderItem: orderItem,
        })

          let singleProductPrice = await cart.aggregate([
            { $match: { user_Id: ObjectId(userId) } },
            { $unwind: "$products" },
            {
              $project: {
                products: "$products.product_Id",
                quantity: "$products.quantity",
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "ProductData",
              },
            },
            { $unwind: "$ProductData" },
  
            {
              $project: {
                total: { $multiply: ["$quantity", "$ProductData.price"] },
              },
            },
            { $project: { _id: 0, total: 1 } },
          ]);
  
          console.log("Checkout page rendered.........");
          const shippingCharge = 55;
          // totalPrice = totalPrice[0].totalAmount;
          // netPrice = totalPrice + shippingCharge;
        
  
        const addressData = userData.addressDetails;
        const orderData = await order.findOne({ user_Id: ObjectId(userId) })
          res.render("user/confirmation",{createOrder, user, cartCount, getProducts, totalAmount, singleProductPrice});
          await cart.deleteOne({ user_Id: ObjectId(userId)})
        
    } catch (error) {
      console.log(error.message);
    }
  },

  // -------------------- Add Address -------------------------------- //

  addAddress: async (req, res) => {
    const user = req.session.email;
    const userId = req.session.userId;

    /* -----------Creating-Order-------------- */
    const name = req.body.name;
    const mobileNumber = req.body.mobile;
    const email = req.body.email;
    const address = req.body.address;
    const city = req.body.city;
    const pinCode = req.body.pincode;

    const addAddress = {
      user_Id: ObjectId(userId),
      name: name,
      address: address,
      email: email,
      city: city,
      mobileNumber: mobileNumber,
      pinCode: pinCode,
    };
    await User.updateOne(
      { email: user },
      { $push: { addressDetails: addAddress } }
    );
    res.redirect("/checkout");
  },

  getWishList: async (req, res) => {
    console.log("cart list page");
    const user = req.session.userId;
    const userId = req.session.userId;
    console.log("userid" + userId);
    try {
      let cartCount = 0;
      let wishList = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
      console.log("Cart Exist");
      if (wishList) {
        cartCount = wishList.products.length;
      }
      
      let getProducts = await wishlist.aggregate([
        { $match: { user_Id: ObjectId(userId) } },

        {
          $unwind: "$products",
        },
        {
          $project: {
            products: "$products.product_Id",
            quantity: "$products.quantity",
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
      ]);

      if (getProducts.length >= 1) {
        let singleProductPrice = await wishlist.aggregate([
          { $match: { user_Id: ObjectId(userId) } },
          { $unwind: "$products" },
          {
            $project: {
              products: "$products.product_Id",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "products",
              foreignField: "_id",
              as: "ProductData",
            },
          },
          { $unwind: "$ProductData" },

          {
            $project: {
              total: { $multiply: ["$quantity", "$ProductData.price"] },
            },
          },
          { $project: { _id: 0, total: 1 } },
        ]);

        // ------------------------------------- Get total price ------------------------------------ //

        let totalPrice = await wishlist.aggregate([
          { $match: { user_Id: ObjectId(userId) } },

          {
            $unwind: "$products",
          },
          {
            $project: {
              products: "$products.product_Id",
              quantity: "$products.quantity",
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
          {
            $group: {
              _id: null,
              totalAmount: {
                $sum: { $multiply: ["$quantity", "$productData.price"] },
              },
            },
          },
          { $project: { _id: 0, totalAmount: 1 } },
        ]);

        console.log(totalPrice[0].totalAmount);
        const total = totalPrice[0].totalAmount;
        res.render("user/wishList", {
          getProducts,
          userId,
          total,
          singleProductPrice,
          user,
          cartCount,
        });
      } else {
        res.render("user/emptyCart", { user, cartCount });
      }
    } catch (error) {
      console.log(error);
    }
  },

  getAddWishList: async (req, res) => {
    try {
      console.log("user cart get page");

      const productId = req.params.id;
      const userId = req.session.userId;
      console.log("user_id :" + userId);
      console.log(`product_id:${productId}`);

      let userWishList = await wishlist.findOne({ user_Id: ObjectId(userId) });

      if (userWishList) {
        const product_Exist = await wishlist.findOne({
          products: { $elemMatch: { product_Id: productId } },
        });

        if (product_Exist) {
          addOneProduct(userId, productId);
          console.log(addOneProduct);
        }
        // if there is no products in cart=>create new product in cart(by updating cart)
        else {
          let createNewProduct = await wishlist
            .updateOne(
              { user_Id: userId },
              { $push: { products: { product_Id: productId } } }
            )
            .then(() => {
              res.json({ status: true });
            });
        }
      }
      // user has not cart, create new Cart
      // console.log("user has not cart")
      else {
        let createWishList = await wishlist
          .create({
            user_Id: userId,
            products: [
              {
                product_Id: productId,
                quantity: 1,
              },
            ],
          })
          .then(() => {
            res.json({ status: true });
          });
      }

      async function addOneProduct(userId, productId) {
        let updateCart = await wishlist.updateOne(
          {
            user_Id: userId,
            products: { $elemMatch: { product_Id: productId } },
          },
          { $inc: { "products.$.quantity": 1 } }
        );
        console.log("updated");
      }
      // res.redirect("/home")
    } catch (error) {
      console.log(error);
    }
  },

};

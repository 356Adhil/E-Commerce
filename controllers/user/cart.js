const User = require("../../models/signUp");
const cart = require("../../models/cart");
const product = require("../../models/product");
const category = require("../../models/category");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getCart: async (req,res)=> {
      console.log("cart list page")
      const user = req.session.userId
      const userId=req.session.userId 
      console.log("userid"+userId)
      try {
        let cartCount = 0;
        let Cart = await cart.findOne({ user_Id: ObjectId(req.session.userId) });
        console.log("Cart Exist" + Cart);
        if (Cart) {
          console.log("akshay.............................");
          cartCount =Cart.products.length;
        }
          let getProducts=await cart.aggregate([
              {$match:{user_Id:ObjectId(userId)}},
  
                  {
                      $unwind:"$products"
                  }
                  ,{
                      $project:{
                          products:"$products.product_Id",
                          quantity:"$products.quantity"
                      }
                   },
                  {
                      $lookup:{
                          from:"products",
                          localField:"products",
                          foreignField:"_id",
                          as:"productData"
                      },
                  },
                  {
                      $project:{
                          products:1,quantity:1,productData:{$arrayElemAt:["$productData",0]}
                      }
                  }    
                ])
     
              console.log("userid=>>>>>>>>>>>>>>>>>>>>>>...   "+userId)
              
              if(getProducts.length>=1){
                  console.log("shobimn shajuuoooooooooooo ")
                      let singleProductPrice=await cart.aggregate ([
                          {$match:{user_Id:ObjectId(userId)}},
                          {$unwind:"$products"},
                          {$project:{
                              products:"$products.product_Id",
                              quantity:"$products.quantity"
                      }},
                          {$lookup:{
                              from:"products",
                              localField:"products",
                              foreignField:"_id",
                              as:"ProductData"
                          }
                          },
                      {$unwind:"$ProductData"},
                      
                      {$project:{total:{$multiply:["$quantity","$ProductData.price"]}}},
                      {$project:{_id:0,total:1}}
                      ])
                  let totalPrice=await cart.aggregate([
                      {$match:{user_Id:ObjectId(userId)}},
              
                          {
                              $unwind:"$products"
                          }
                          ,{
                              $project:{
                                  products:"$products.product_Id",
                                  quantity:"$products.quantity"
                              }
                           },
                          {
                              $lookup:{
                                  from:"products",
                                  localField:"products",
                                  foreignField:"_id",
                                  as:"productData"
                              },
                          },
                          {
                              $project:{
                                  products:1,quantity:1,productData:{$arrayElemAt:["$productData",0]}
                              }
                          },
                          {
                              $group:{
                                  _id:null,
                                  totalAmount:{$sum:{$multiply:["$quantity","$productData.price"]}}
                              }
                          },
                          {$project:{_id:0,totalAmount:1}}
              
              ])
             
              console.log( totalPrice[0].totalAmount)
              const total=totalPrice[0].totalAmount
              console.log("yaaasir");
              console.log(total);
              res.render('user/cart',{getProducts ,userId, total, singleProductPrice, user, cartCount})
              }else{
                  
                res.render('user/emptyCart',{ user, cartCount })
              }
          
          console.log(getProducts.length)  

    } 
       catch (error) {
          console.log(error)
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
      console.log("und=>>" + userCart);

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

  getDeleteCartProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.session.userId;
      console.log("user_id :" + userId);
      console.log(`product_id:${productId}`);
      let userCart = await cart.findOne({ user_Id: ObjectId(userId) });
      console.log("und=>>" + userCart);

      if (userCart) {
        await cart.deleteOne({ products: [productId] });
      } else {
        console.log("Nothing To Delete");
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  // ==================================== Start Some Ajax ========================== //

    // ------------------------------- total amount ajax cart -------------------- //


//   totalAmount: async(req,res) =>{

//     const userId = req.session.userId;
//     const userData = await User.findOne({email:userId});
//     // console.log("without underscore",userData);
//    // console.log(userData._id);
//     const objId = mongoose.Types.ObjectId(userData._id);
//     const product = mongoose.Types.ObjectId(req.body.product);
//     if(req.session.consumer){
//         if(userId){
//             customer = true;
//         } else {
//             customer = false;
//         }
//     }
//     const productData = await cart.aggregate([
//         {
//             $match: { userId:objId},
//         },
//         {
//             $unwind:"$product",
//         },
//         {
//             $project:{
//                 productItem: "$product.productId",
//                 productQuantity:"$product.quantity"
//             },
//         },
//         {
//             $lookup:{
//                 from:"products",
//                 localField:"productItem",
//                 foreignField:"_id",
//                 as:"productDetail"
//             },
//         },
//         {
//             $project:{
//                 productItem : 1,
//                 productQuantity : 1,
//                 productDetail : {$arrayElemAt : ["$productDetail",0]},
//             },
//         },
//         {
//             $addFields:{
//                 productPrice: {
//                     $multiply: ["$productQuantity","$productDetail.price"],
//                 },
//             },
//         },
//         {
//             $group:{
//                 _id:userData.id,
//                 total:{
//                     $sum:{ $multiply:["$productQuantity","$productDetail.price"]},
//                 },
//                 productPrice: {
//                     $push: {
//                         item: "$productItem",
//                         price: "$productPrice",
//                     },
//                 },
//             }
//         },
//         {
//             $project: {
//                 total: 1,
//                 _id: 1,                
//                 product: {
//                     $filter: {
//                        input: "$productPrice",
//                        as: "num",
//                        cond: { $eq: ["$$num.item", product] }
//                     }
//                   }
//             }
//         }
//     ]).exec();
//     res.json({status:true,productData:productData[0]});
   
// },
// -------------------------------------------------------------------------------------------------- //
  // ------------------------------- Changing product Qty & price -------------------- //

//   changeQuantity: async(req,res,next)=>{
//     const data = req.body;
//     const objId = mongoose.Types.ObjectId(data.product);
//     data.count = parseInt(data.count);
//     data.quantity = parseInt(data.quantity);
//     if(data.count==-1 && data.quantity==1){
//         res.json({quantity:true})
//     }else{
//         cart.updateOne(
//             {
//             _id:data.cart,"product.productId":objId
//             },
//             {$inc: { "product.$.quantity":data.count}}
//         ).then(()=>{
//             next();
    
//         })
//     }
// },

  // ==================================== End Some Ajax ========================== //


  // ------------------------------- Changing product Qty & price -------------------- //

  changeQuantity: async (req, res) => {
    console.log(req.body);
    console.log("postchange");
    console.log(req.session);
    console.log(req.body);

    try {
      const cartId = req.body.cart;
      const productId = req.body.product;
      const quantity = parseInt(req.body.quantity);
      const count = parseInt(req.body.count);
      if (count == -1 && quantity == 1) {
        console.log("removing start....");
        // let productPull = await cart
        //   .updateOne(
        //     { _id: cartId },
        //     { $pull: { products: { product_Id: productId } } }
        //   )
        //   .then(() => {
        //     res.json({ statusRemove: true });
        //   });
      } else {
        let userProdExist = await cart.findOne({
          _id: cartId,
          products: { $elemMatch: { product_Id: productId } },
        });
        console.log(userProdExist);
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
      }
    } catch (error) {
      console.log(error);
    }
  },
};

const product = require("../../models/product");
const category = require("../../models/category");

module.exports = {
  getEditProduct: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
      const getAddCategory = await category.find();
      const productData = await product.findById(id);
      console.log(productData);
      if (productData) {
        res.render("admin/editProduct", { product: productData, category: getAddCategory });
      } else {
        res.redirect("/admin/Product");
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  postEditProduct: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(req.files)
      if(req.files.length>0){
        const editImage = req.files.map((f)=>({url:f.path, filename:f.filename}))
        const imageProduct = await product.updateOne({ _id: id },{$set:{ imageUrl: editImage }})  
      }
      const productData = await product.updateOne(
        {_id: id },
        {
          $set: {
            title: req.body.title,
            size: req.body.size,
            price: req.body.price,
            qty: req.body.qty,
            category: req.body.category,
            description: req.body.description,
          },
        }
      );
      
      res.redirect("/admin/product");
    } catch (error) {
      console.log(error.message);
    }
  },
};

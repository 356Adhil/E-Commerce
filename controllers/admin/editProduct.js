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
      console.log(id);
      const productData = await product.updateOne(
        { id },
        {
          $set: {
            title: req.body.title,
            size: req.body.size,
            price: req.body.price,
            qty: req.body.qty,
            category: req.body.category,
            imageUrl: req.body.myFiles,
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

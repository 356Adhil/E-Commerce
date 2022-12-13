const product = require("../../models/product");
const category = require("../../models/category");


module.exports = {
  getAddProduct: async (req, res) => {
    try {
      const getAddCategory = await category.find();
      console.log(getAddCategory);
      res.render("admin/addProduct", { getAddCategory });
    } catch (error) {}
  },

  postAddProduct: async (req, res) => {
    console.log("add");
    const title = req.body.title;
    const size = req.body.size;
    const price = req.body.price;
    const qty = req.body.qty;
    const category = req.body.category;
    const description = req.body.description;
    try {
      const products = new product({
        title: title,
        size: size,
        price: price,
        qty: qty,
        category: category,
        description: description,
      });
      products.imageUrl = req.files.map((f)=>({url:f.path, filename:f.filename}))
      const productitem = await products.save();

      res.redirect("/admin/product");
    } catch (error) {
      console.log(error.message);
    }
  },
};

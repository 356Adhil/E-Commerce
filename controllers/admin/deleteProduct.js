const product = require("../../models/product");

module.exports = {
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      await product.findByIdAndDelete(id);
      res.redirect("/admin/product");
    } catch (error) {
      console.log(error.message);
    }
  },
};

const product = require("../../models/product");

module.exports = {
    getAddProduct: (req, res) => {
        res.render("admin/addProduct");
      },

    postAddProduct: async (req, res) => {
        try {
            const title = req.body.title
            const size = req.body.size
            const price = req.body.price
            const qty =req.body.qty
            const category = req.body.category
            const description = req.body.description

            const products = new product({
                title: title,
                size: size,
                price: price,
                qty: qty,
                category: category,
                description: description,
              });
              const addProduct = await products.save();
              if(addProduct){
                res.redirect("/admin/userDetails")
              }else {
                res.render("admin/addProduct");
              }
        } catch (error) {
            console.log(error.message);
        }
        
      },

};

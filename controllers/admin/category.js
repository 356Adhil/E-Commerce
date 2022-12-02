const category = require("../../models/category");

module.exports = {
  getCategory: async (req, res) => {
    const categoryData = await category.find();
    res.render("admin/category", { category: categoryData });
  },

  getAddCategory: (req, res) => {
    console.log("cat");
    res.render("admin/addCategory");
  },

  postAddCategory: async (req, res) => {
    try {
      const name = req.body.categoryName;

      const addCategory = await category.create({
        name: name,
      });
      console.log("hello world");
      if (addCategory) {
        res.redirect("/admin/category");
      } else {
        res.redirect("/admin/addCategory");
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  getEditCategory: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
      const categoryData = await category.findById(id);
      console.log(categoryData);
      if (categoryData) {
        res.render("admin/editCategory", { category: categoryData });
      } else {
        res.redirect("/admin/category");
      }
    } catch (error) {
      console.log(error);
    }
  },

  postEditCategory: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const categoryData = await category.updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.categoryName,
          },
        }
      );
      res.redirect("/admin/category");
    } catch (error) {
      console.log(error);
    }
  },
};

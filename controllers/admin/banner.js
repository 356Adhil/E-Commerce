const banner = require("../../models/banner");

module.exports = {
  getBanner: async (req, res) => {
    const bannerData = await banner.find();
    res.render("admin/banner", { banner: bannerData });
  },

  getAddBanner: (req, res) => {
    res.render("admin/addBanner");
  },

  postAddBanner: async (req, res) => {
    const head = req.body.head;
    const subHead = req.body.subHead;
    const description = req.body.descriptions;
    const image = req.file.filename;
    try {
        const banners = await banner.create({
            head: head,
            subHead: subHead,
            description: description,
            bannerImage: image,
        })
        res.redirect("/admin/banner")
    } catch (error) {
        console.log(error);
    }
  },
};

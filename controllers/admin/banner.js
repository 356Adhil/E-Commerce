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
    try {
        const banners = new banner({
            head: head,
            subHead: subHead,
            description: description,
        })
        banners.bannerImage = req.files.map((f)=>({url:f.path, filename:f.filename}))
        const banneritem = await banners.save();
        res.redirect("/admin/banner")
    } catch (error) {
        console.log(error);
    }
  },
};

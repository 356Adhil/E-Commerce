const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bannerSchema = new Schema({
    head: {
        type: String,
        required: true
    },
    subHead: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true,
      },
});

const banner = mongoose.model("banners", bannerSchema);
module.exports = banner;
